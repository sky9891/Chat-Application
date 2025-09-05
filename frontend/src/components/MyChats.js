import { Box, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getSender } from "../config/ChatLogics"; // make sure your file is named ChatLogics.js
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import { socket } from "../config/socket";
import { useToast } from "@chakra-ui/react";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const toast = useToast();

  // Determine API URL
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

  const fetchChats = async () => {
    try {
      const token =
        user?.token || JSON.parse(localStorage.getItem("userInfo"))?.token;
      if (!token) return;

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const { data } = await axios.get(`${API_URL}/api/chat`, config);
      setChats(data);
    } catch (error) {
      console.error("Error fetching chats:", error);
      toast({
        title: "Error Occurred!",
        description: "Failed to load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setLoggedUser(userInfo);
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  // Socket listener for new messages
  useEffect(() => {
    socket.on("message received", (newMessage) => {
      if (!selectedChat || selectedChat._id !== newMessage.chat._id) {
        // Optional: trigger notification here
      } else {
        setChats((prevChats) => {
          const updatedChats = prevChats.map((chat) =>
            chat._id === newMessage.chat._id
              ? { ...chat, latestMessage: newMessage }
              : chat
          );
          return updatedChats;
        });
      }
    });

    return () => socket.off("message received");
  }, [selectedChat, setChats]);

  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
      </Box>

      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name}: </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <Text>Loading chats...</Text>
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
