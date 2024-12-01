import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";

export const setupSocket = (server: any) => {
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("New client connected");

    // Room joining functionality
    socket.on("joinRoom", (room: string) => {
      socket.join(room);
      console.log(`User joined room: ${room}`);
    });

    // Handling messages and broadcasting to room
    socket.on("message", (data: { room: string; message: string }) => {
      io.to(data.room).emit("message", data.message);
    });

    // Handling disconnection
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};
