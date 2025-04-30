import { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router';
import userStore from '../store/users.store';
import { io } from 'socket.io-client';
import apiInstance from '../api/axios.config';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Badge,
  Paper,
  // Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  // Container,
  AppBar,
  Toolbar,
  InputAdornment,
  Drawer,
  useTheme,
  useMediaQuery,
  styled,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Send as SendIcon,
  Search as SearchIcon,
  Menu as MenuIcon,
  ArrowBack as ArrowBackIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';

// Types from your existing code
interface MessageInterface {
  _id: string;
  sender: string;
  receiver: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ChatUser {
  _id: string;
  username: string;
  email: string;
  fullname: string;
  lastMessage?: string;
  lastMessageTime?: Date;
}

// Styled components for online status badge
const OnlineBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

export default function ChattingPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  // Getting user data from Zustand store
  const user = userStore((state) => state.user);
  const onlineUsers = userStore((state) => state.onlineUsers);
  const inboxChatUsers = userStore((state) => state.inboxChatUsers);
  const setOnlineUsers = userStore((state) => state.setOnlineUsers);
  const setInboxChatUsers = userStore((state) => state.setInboxChatUsers);

  // Client side Socket.IO connection
  const socket = useMemo(() => io("http://localhost:3000", {query: {username: user.username}}), []);

  const navigate = useNavigate(); 

  const [messages, setMessages] = useState<MessageInterface[]>([]); // state to store messages
  const [currentMessage, setCurrentMessage] = useState(''); // Current message input
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null); // Selected user for chat
  const [searchQuery, setSearchQuery] = useState(''); // For user search
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false); // For mobile drawer state

  // Effect for socket connection
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server", socket.id);
    });

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
      console.log("Online users:", users);
    });

    socket.on("receiveMessage", (message) => {
      // Add logic to handle incoming messages
      if ((selectedUser && (message.sender === selectedUser._id || message.receiver === selectedUser._id)) || 
          message.sender === user._id || message.receiver === user._id) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => {
      socket.on("disconnect", () => {
        console.log("Disconnected from server", socket.id);
      });
    };
  }, [socket, selectedUser]);

  // Effect for initial data loading
  useEffect(() => {
    // Check if user is logged in
    if (!user.username) {
      navigate("/signin");
      return;
    }

    // Load chat users
    apiInstance
      .post("/chats/load-users", {
        user: { _id: user._id, username: user.username },
        chatUsers: inboxChatUsers
      })
      .then(response => {
        if (response.data.success === true) {
          setInboxChatUsers(response.data.data);
        } else {
          console.log("Error loading chat users", response.data);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  // Effect to scroll to bottom when new messages arrive
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Function to handle sending messages
  const handleSendMessage = () => {
    if (currentMessage.trim() === "" || !selectedUser) return;
    
    const messageToSend = currentMessage;
    setCurrentMessage(''); // Clear input field immediately for better UX

    // Call the provided function to send the message
    if (selectedUser) {
      handleSendMessageFunction(messageToSend, selectedUser._id);
    }
  };

  // Wrapper for the provided handleSendMessage function
  const handleSendMessageFunction = (message: string, receiverId: string) => {
    socket.emit("sendMessage", message, user._id, receiverId);

    apiInstance
      .post("/chats/current-message", {
        sender: user._id, 
        receiver: receiverId, 
        text: message
      })
      .then(response => {
        if (response.data.success === true) {
          setMessages((prevMessages) => [...prevMessages, response.data.data]);
        } else {
          console.log("Error sending message", response.data);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  // Load messages when selecting a user
  const handleSelectUser = (chatUser: ChatUser) => {
    setSelectedUser(chatUser);
    setIsLoading(true);
    
    // Close mobile drawer when selecting a user
    if (isMobile) {
      setMobileDrawerOpen(false);
    }
    
    // Get messages between the current user and selected user
    getMessages(user._id, chatUser._id);
  };

  // Function to load messages
  const getMessages = (senderId: string, receiverId: string) => {
    apiInstance
      .post("/chats/load-messages", { sender: senderId, receiver: receiverId })
      .then(response => {
        if (response.data.success === true) {
          setMessages(response.data.data);
        } else {
          console.log("Error loading messages", response.data);
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.log(error);
        setIsLoading(false);
      });
  };

  // Format time function
  const formatTime = (date: Date | string) => {
    const messageDate = new Date(date);
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Check if user is online
  const isUserOnline = (username: string) => {
    return onlineUsers.includes(username);
  };

  // Filter users based on search
  const filteredUsers = inboxChatUsers.filter(chatUser => 
    chatUser.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (chatUser.username && chatUser.username.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Toggle drawer for mobile
  const toggleDrawer = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  // User list component
  const UsersList = () => (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: 'background.paper',
      borderRight: 1,
      borderColor: 'divider',
    }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Messages
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      
      <List sx={{ overflow: 'auto', flexGrow: 1 }}>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((chatUser) => (
            <ListItem
              button
              component={'button'}
              key={chatUser._id}
              selected={selectedUser?._id === chatUser._id}
              onClick={() => handleSelectUser(chatUser)}
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&.Mui-selected': {
                  backgroundColor: 'action.selected',
                },
              }}
            >
              <ListItemAvatar>
                {isUserOnline(chatUser.username) ? (
                  <OnlineBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                  >
                    <Avatar alt={chatUser.username} src={`https://ui-avatars.com/api/?name=${chatUser.username}&background=random`} />
                  </OnlineBadge>
                ) : (
                  <Avatar alt={chatUser.username} src={`https://ui-avatars.com/api/?name=${chatUser.username}&background=random`} />
                )}
              </ListItemAvatar>
              <ListItemText
                primary={chatUser.username}
                secondary={
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {chatUser.lastMessage || 'No messages yet'}
                  </Typography>
                }
              />
              {chatUser.lastMessageTime && (
                <Typography variant="caption" color="text.secondary">
                  {formatTime(chatUser.lastMessageTime)}
                </Typography>
              )}
            </ListItem>
          ))
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No conversations found
            </Typography>
          </Box>
        )}
      </List>
    </Box>
  );

  // Chat area component
  const ChatArea = () => {
    if (!selectedUser) {
      return (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'background.default',
            p: 3,
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mb: 2,
              bgcolor: 'primary.light',
            }}
          >
            <SendIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          </Avatar>
          <Typography variant="h5" gutterBottom>
            Welcome to Connectt
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            Select a conversation from the list to start chatting
          </Typography>
        </Box>
      );
    }

    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.paper',
        }}
      >
        {/* Chat header */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: 'background.paper',
            color: 'text.primary',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Toolbar>
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                onClick={toggleDrawer}
                sx={{ mr: 1 }}
              >
                <ArrowBackIcon />
              </IconButton>
            )}
            
            {isUserOnline(selectedUser.username) ? (
              <OnlineBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
              >
                <Avatar 
                  alt={selectedUser.username} 
                  src={`https://ui-avatars.com/api/?name=${selectedUser.fullname || selectedUser.username}&background=random`} 
                />
              </OnlineBadge>
            ) : (
              <Avatar 
                alt={selectedUser.username} 
                src={`https://ui-avatars.com/api/?name=${selectedUser.fullname || selectedUser.username}&background=random`} 
              />
            )}
            
            <Box sx={{ ml: 2, flexGrow: 1 }}>
              <Typography variant="subtitle1" fontWeight="medium">
                {selectedUser.fullname || selectedUser.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isUserOnline(selectedUser.username) ? 'Online' : 'Offline'}
              </Typography>
            </Box>
            
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        
        {/* Messages area */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            p: 2,
            bgcolor: '#f5f5f5',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : messages.length > 0 ? (
            messages.map((msg, index) => {
              const isCurrentUser = msg.sender === user._id;

              return (
                <Box
                  key={msg._id || index}
                  sx={{
                    display: 'flex',
                    justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                    mb: 1.5,
                  }}
                >
                  {!isCurrentUser && (
                    <Avatar
                      alt={selectedUser.username}
                      src={`https://ui-avatars.com/api/?name=${selectedUser.fullname || selectedUser.username}&background=random`}
                      sx={{ width: 32, height: 32, mr: 1, alignSelf: 'flex-end' }}
                    />
                  )}
                  
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      px: 2,
                      maxWidth: '70%',
                      borderRadius: 2,
                      bgcolor: isCurrentUser ? 'primary.main' : 'background.paper',
                      color: isCurrentUser ? 'primary.contrastText' : 'text.primary',
                    }}
                  >
                    <Typography variant="body1">{msg.text}</Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        textAlign: 'right',
                        mt: 0.5,
                        opacity: 0.7,
                      }}
                    >
                      {formatTime(msg.createdAt)}
                    </Typography>
                  </Paper>
                  
                  {isCurrentUser && (
                    <Avatar
                      alt={user.username}
                      src={`https://ui-avatars.com/api/?name=${user.username}&background=random`}
                      sx={{ width: 32, height: 32, ml: 1, alignSelf: 'flex-end' }}
                    />
                  )}
                </Box>
              );
            })
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Typography color="text.secondary">
                No messages yet. Start the conversation!
              </Typography>
            </Box>
          )}
          <div ref={messageEndRef} />
        </Box>
        
        {/* Message input */}
        <Box
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Box sx={{ display: 'flex' }}>
            <TextField
              fullWidth
              placeholder="Type a message..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              size="medium"
              sx={{ mr: 1 }}
            />
            <Tooltip title="Send message">
              <IconButton 
                color="primary" 
                onClick={handleSendMessage}
                disabled={!currentMessage.trim()}
                sx={{ 
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  '&.Mui-disabled': {
                    bgcolor: 'action.disabledBackground',
                    color: 'action.disabled',
                  }
                }}
              >
                <SendIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex' }}>
      {/* Desktop and mobile layout handling */}
      {isMobile ? (
        <>
          {/* Mobile drawer for user list */}
          <Drawer
            variant="temporary"
            open={mobileDrawerOpen}
            onClose={toggleDrawer}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { width: '85%', boxSizing: 'border-box' },
            }}
          >
            <UsersList />
          </Drawer>
          
          {/* Mobile main content area */}
          <Box sx={{ flexGrow: 1 }}>
            {!selectedUser && !mobileDrawerOpen ? (
              // Show user list button when no chat is selected
              <Box 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column'
                }}
              >
                <AppBar position="static" elevation={1}>
                  <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>Connectt</Typography>
                    <IconButton color="inherit" onClick={toggleDrawer}>
                      <MenuIcon />
                    </IconButton>
                  </Toolbar>
                </AppBar>
                <Box 
                  sx={{ 
                    flexGrow: 1, 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    flexDirection: 'column',
                    p: 3,
                    textAlign: 'center'
                  }}
                >
                  <Typography variant="h5" gutterBottom>
                    Welcome to Connectt
                  </Typography>
                  <Typography variant="body1" paragraph color="text.secondary">
                    Open the menu to see your conversations
                  </Typography>
                  <IconButton 
                    color="primary" 
                    onClick={toggleDrawer}
                    size="large"
                    sx={{ 
                      bgcolor: 'primary.light',
                      '&:hover': { bgcolor: 'primary.main', color: 'white' }
                    }}
                  >
                    <MenuIcon fontSize="large" />
                  </IconButton>
                </Box>
              </Box>
            ) : (
              <ChatArea />
            )}
          </Box>
        </>
      ) : (
        // Desktop layout
        <>
          <Box sx={{ width: 320, flexShrink: 0 }}>
            <UsersList />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <ChatArea />
          </Box>
        </>
      )}
    </Box>
  );
}