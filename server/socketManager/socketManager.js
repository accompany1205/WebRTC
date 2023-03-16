const users = {};

const socketToRoom = {};

//const meetingAudioMuted = {};
//const meetingVideoDisable = {};
//const isMeetingPrivate = {};

exports = module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("join room", (payload) => {
      let roomID = payload.roomID;
      socketToRoom[socket.id] = roomID;
      console.log(JSON.stringify(payload));
      if (users[roomID]) {
        let isAudio = payload.isAudio;
        let isVideo = payload.isVideo;
        const length = users[roomID].length;
        if (length === process.env.USER_LENGTH) {
          socket.emit("room full");
          return;
        }
        users[roomID].push({
          socketID: socket.id,
          userName: payload.userName,
          isAudio: isAudio,
          isVideo: isVideo,
          initiator: null,
        });
        const usersInThisRoom = users[roomID].filter(
          (id) => id.socketID !== socket.id
        );
        socket.emit("all users", {
          usersInThisRoom: usersInThisRoom,
          connectedUsers: users[roomID].length,
        });
      } else {
        users[roomID] = [
          {
            socketID: socket.id,
            userName: payload.userName,
            isAudio: payload.isAudio,
            isVideo: payload.isVideo,
            initiator: payload.userName,
          },
        ];

        const usersInThisRoom = users[roomID].filter(
          (id) => id.socketID !== socket.id
        );
        socket.emit("all users", {
          usersInThisRoom: usersInThisRoom,
          connectedUsers: users[roomID].length,
        });
        /* console.log(
          "Join Room users[roomID] = " + JSON.stringify(usersInThisRoom)
        );*/
      }
    });

    // before greenroom set calling
    socket.on("checkIsRoomIDExist", (payload) => {
      let roomID = payload.roomID;
      if (users[roomID]) {
        socket.emit("roomStatus", {
          isValid: true,
        });
        console.log("checkIsRoomIDExist = true");
      } else {
        socket.emit("roomStatus", {
          isValid: false,
        });
        console.log("checkIsRoomIDExist = false");
      }
    });

    // after greenroom set calling (same username can not join meeting)
    socket.on("checkIsValidRoomID", (payload) => {
      let roomID = payload.roomID;
      let userName = payload.userName;

      if (users[roomID]) {
        let usersNameIsExist = users[roomID].filter(
          (id) => id.userName === userName
        );

        if (usersNameIsExist.length === 0) {
          socket.emit("roomIdStatus", {
            isValid: true,
            isMeetingPrivate: false,
          });
          console.log("checkIsValidRoomID = true");
        } else {
          socket.emit("roomIdStatus", {
            isValid: false,
            isMeetingPrivate: false,
          });
          console.log("checkIsValidRoomID = false");
        }
      } else {
        socket.emit("roomIdStatus", {
          isValid: false,
          isMeetingPrivate: false,
        });
        console.log("checkIsValidRoomID = false");
      }
    });

    socket.on("sending signal", (payload) => {
      const roomID = socketToRoom[socket.id];

      io.to(payload.userToSignal).emit("user joined", {
        signal: payload.signal,
        callerID: payload.callerID,
        connectedUsers: users[roomID].length,
        userName: payload.userName,
        isAudio: payload.isAudio,
        isVideo: payload.isVideo,
      });
      //console.log("sending signal payload " + JSON.stringify(payload));
      // console.log("sending signal users " + JSON.stringify(users[roomID]));
    });

    socket.on("returning signal", (payload) => {
      const roomID = socketToRoom[socket.id];

      io.to(payload.callerID).emit("receiving returned signal", {
        signal: payload.signal,
        id: socket.id,
        connectedUsers: users[roomID].length,
      });
      //console.log("Returning Signal");
    });

    socket.on("toggleAudio", (payload) => {
      const roomID = socketToRoom[socket.id];
      users[roomID].map((index) => {
        if (index.socketID === socket.id) index.isAudio = payload.isAudio;
      });
      const usersInThisRoom = users[roomID].filter(
        (id) => id.socketID !== socket.id
      );

      usersInThisRoom.map((socketID) => {
        io.to(socketID.socketID).emit("receiving_audio_status", {
          isAudio: payload.isAudio,
          callerID: socket.id,
        });
      });

      /*  console.log(
        "toggleAudio send usersInThisRoom : " + JSON.stringify(usersInThisRoom)
      );
      console.log(
        "toggleAudio update in users[roomID] : " + JSON.stringify(users[roomID])
      );*/
    });

    socket.on("toggleVideo", (payload) => {
      const roomID = socketToRoom[socket.id];
      users[roomID].map((index) => {
        if (index.socketID === socket.id) index.isVideo = payload.isVideo;
      });
      const usersInThisRoom = users[roomID].filter(
        (id) => id.socketID !== socket.id
      );
      usersInThisRoom.map((socketID) => {
        io.to(socketID.socketID).emit("receiving_video_status", {
          isVideo: payload.isVideo,
          callerID: socket.id,
        });
      });

      /* console.log(
        "toggleVideo update in users[roomID] : " + JSON.stringify(users[roomID])
      );
      console.log(
        "toggleVideo send usersInThisRoom : " + JSON.stringify(usersInThisRoom)
      );*/
    });

    socket.on("meetingDuration", (payload) => {
      const roomID = socketToRoom[socket.id];

      const usersInThisRoom = users[roomID].filter(
        (id) => id.socketID !== socket.id
      );

      usersInThisRoom.map((socketID) => {
        io.to(socketID.socketID).emit("receiving meetingDuration", {
          duration: payload.duration,
        });
      });
    });

    socket.on("disconnectcall", (payload) => {
      const roomID = socketToRoom[socket.id];
      let room = users[roomID];
      console.log(JSON.stringify(payload));
      if (room) {
        room = room.filter((id) => id.socketID !== socket.id);
        users[roomID] = room;
        if (payload.isAdmin) {
          users[roomID].map((socketID) => {
            io.to(socketID.socketID).emit("disconnect_all", {
              isDisconnectAll: true,
              userName: payload.userName,
              connectedUsers: users[roomID].length,
            });
          });
          users[roomID] = null;
          // console.log("Disconnect meeting for all ");
        } else {
          users[roomID].map((socketID) => {
            io.to(socketID.socketID).emit("disconnect_all", {
              isDisconnectAll: false,
              userName: payload.userName,
              connectedUsers: users[roomID].length,
            });
          });
          // console.log("Disconnect meeting for single user ");
        }
      }
      //console.log("After Disconnect Call users[roomID]" + JSON.stringify(users[roomID]));
    });

  });
};
