import { Stack, Box } from "@chakra-ui/layout";
import { Skeleton } from "@chakra-ui/skeleton";

const ChatLoading = ({ count = 8 }) => {
  return (
    <Stack spacing={3}>
      {Array(count)
        .fill("")
        .map((_, i) => (
          <Box
            key={i}
            display="flex"
            justifyContent={i % 2 === 0 ? "flex-start" : "flex-end"} // 🔥 alternate left/right
          >
            <Skeleton
              height="40px"
              width={`${Math.floor(Math.random() * 40) + 40}%`} // 🔥 random width 40–80%
              borderRadius="20px" // 🔥 bubble look
            />
          </Box>
        ))}
    </Stack>
  );
};

export default ChatLoading;
