import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router';
import { io } from 'socket.io-client';
import userStore from '../store/users.store';
import apiInstance from '../api/axios.config';
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  IconButton,
  Paper,
//   Divider,
  Badge,
  InputAdornment,
  AppBar,
  Toolbar,
//   Drawer,
  useMediaQuery,
  useTheme,
//   Skeleton,
//   Stack,
  Menu,
  MenuItem,
//   Button
} from '@mui/material';
import {
  Send as SendIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Menu as MenuIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiIcon,
  Phone as PhoneIcon,
  Videocam as VideoIcon,
  ArrowBack as ArrowBackIcon,
//   Circle as CircleIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Types
interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  isRead: boolean;
}

interface ChatUser {
  id: string;
  username: string;
  avatar: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
  isOnline: boolean;
}

const StyledBadge = styled(Badge)(({ theme }) => ({
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

const ChattingPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  // Current user from store
  const user = userStore(state => state.user);
  
  // Socket connection
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const socket = useMemo(() => io("http://localhost:3000", {
    query: {
      username: user.username,
    },
    withCredentials: true,
  }), [user.username]);
  
  // Socket state
  const [socketId, setSocketId] = useState<string | null>();
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  
  // UI state
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentMessage, setCurrentMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedChat, setSelectedChat] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Mock data for demo - replace with your API data
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([
    {
      id: '1',
      username: 'Jane Cooper',
      avatar: 'https://mui.com/static/images/avatar/1.jpg',
      lastMessage: 'Hey, how are you doing?',
      lastMessageTime: new Date(Date.now() - 15 * 60000), // 15 minutes ago
      unreadCount: 3,
      isOnline: true
    },
    {
      id: '2',
      username: 'Alex Smith',
      avatar: 'https://mui.com/static/images/avatar/2.jpg',
      lastMessage: 'The project deadline is tomorrow!',
      lastMessageTime: new Date(Date.now() - 2 * 3600000), // 2 hours ago
      unreadCount: 0,
      isOnline: true
    },
    {
      id: '3',
      username: 'Sarah Parker',
      avatar: 'https://mui.com/static/images/avatar/3.jpg',
      lastMessage: 'Thanks for your help yesterday',
      lastMessageTime: new Date(Date.now() - 24 * 3600000), // 1 day ago
      unreadCount: 0,
      isOnline: false
    },
    {
      id: '4',
      username: 'Robert Johnson',
      avatar: 'https://mui.com/static/images/avatar/4.jpg',
      lastMessage: 'See you at the meeting',
      lastMessageTime: new Date(Date.now() - 3 * 24 * 3600000), // 3 days ago
      unreadCount: 0,
      isOnline: false
    }
  ]);
  
  // Mock message history - replace with your API data
  const mockMessages: Record<string, Message[]> = {
    '1': [
      {
        id: '101',
        text: 'Hey there!',
        sender: '1',
        timestamp: new Date(Date.now() - 3600000),
        isRead: true
      },
      {
        id: '102',
        text: 'How are you doing?',
        sender: '1',
        timestamp: new Date(Date.now() - 3500000),
        isRead: true
      },
      {
        id: '103',
        text: 'I\'m doing well, thanks for asking! How about you?',
        sender: user.username || 'current',
        timestamp: new Date(Date.now() - 3400000),
        isRead: true
      },
      {
        id: '104',
        text: 'Pretty good! Just working on that project we discussed.',
        sender: '1',
        timestamp: new Date(Date.now() - 3300000),
        isRead: true
      },
      {
        id: '105',
        text: 'By the way, are you free for a meeting tomorrow?',
        sender: '1',
        timestamp: new Date(Date.now() - 900000),
        isRead: false
      },
      {
        id: '106',
        text: 'We need to discuss the new features.',
        sender: '1',
        timestamp: new Date(Date.now() - 800000),
        isRead: false
      },
      {
        id: '107',
        text: 'And don\'t forget to bring those documents I asked about!',
        sender: '1',
        timestamp: new Date(Date.now() - 700000),
        isRead: false
      }
    ],
    '2': [
      {
        id: '201',
        text: 'The project deadline is tomorrow!',
        sender: '2',
        timestamp: new Date(Date.now() - 7200000),
        isRead: true
      }
    ],
    '3': [
      {
        id: '301',
        text: 'Thanks for your help yesterday',
        sender: '3',
        timestamp: new Date(Date.now() - 86400000),
        isRead: true
      }
    ],
    '4': [
      {
        id: '401',
        text: 'See you at the meeting',
        sender: '4',
        timestamp: new Date(Date.now() - 259200000),
        isRead: true
      }
    ]
  };
  
  // Format timestamp to readable time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format date for message groups
  const formatMessageDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };
  
  // Socket connection management
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server with id: " + socket.id);
      setSocketId(socket.id);
      setIsConnected(true);
    });

    socket.on("onlineUsers", (users: string[]) => {
      setOnlineUsers(users);
      
      // Update the online status of users
      setChatUsers(prevUsers => 
        prevUsers.map(user => ({
          ...user,
          isOnline: users.includes(user.username)
        }))
      );
    });

    return () => {
      socket.disconnect();
      console.log("Disconnected from server");
    };
  }, [socket]);

  // Fetch user profile
  const fetchUser = async function() {
    try {
      let response = await apiInstance.get("/auth/profile");
      if (response.data.success === false) navigate("/signin");
    } catch (error) {
      console.log(error);
      navigate("/signin");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  
  // Load messages when a chat is selected
  useEffect(() => {
    if (selectedChat) {
      setMessages(mockMessages[selectedChat.id] || []);
      
      // Mark messages as read
      if (selectedChat.unreadCount && selectedChat.unreadCount > 0) {
        setChatUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === selectedChat.id ? { ...user, unreadCount: 0 } : user
          )
        );
      }
    }
  }, [selectedChat]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Send message handler
  const handleSendMessage = () => {
    if (!currentMessage.trim() || !selectedChat) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: currentMessage,
      sender: user.username || 'current',
      timestamp: new Date(),
      isRead: false
    };
    
    setMessages([...messages, newMessage]);
    setCurrentMessage('');
    
    // Update last message in chat list
    setChatUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === selectedChat.id 
          ? { 
              ...user, 
              lastMessage: currentMessage,
              lastMessageTime: new Date()
            } 
          : user
      )
    );
    
    // Here you would send the message via socket
    // socket.emit('send-message', { to: selectedChat.id, message: currentMessage });
  };
  
  // Filter users based on search
  const filteredUsers = chatUsers.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Toggle menu
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  // Handle mobile chat selection
  const handleChatSelect = (chat: ChatUser) => {
    setSelectedChat(chat);
    if (isMobile) {
      setMobileDrawerOpen(false);
    }
  };

  // Toggle mobile drawer
  const handleDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };
  
  // Handle back button on mobile
  const handleBackToList = () => {
    setSelectedChat(null);
    if (isMobile) {
      setMobileDrawerOpen(true);
    }
  };

  // User list component
  const UsersList = () => (
    <Paper 
      elevation={0} 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRight: 1, 
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight="medium">Messages</Typography>
        <TextField
          fullWidth
          placeholder="Search users..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 1 }}
        />
      </Box>
      
      <List sx={{ overflow: 'auto', flexGrow: 1 }}>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((chatUser) => (
            <ListItem 
              key={chatUser.id} 
              component={'div'}
              onClick={() => handleChatSelect(chatUser)}
              sx={{
                position: 'relative',
                borderBottom: '1px solid',
                borderColor: 'divider',
                backgroundColor: selectedChat?.id === chatUser.id ? 'action.selected' : 'inherit',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                cursor: 'pointer',
              }}
            >
              <ListItemAvatar>
                {chatUser.isOnline ? (
                  <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                  >
                    <Avatar alt={chatUser.username} src={chatUser.avatar} />
                  </StyledBadge>
                ) : (
                  <Avatar alt={chatUser.username} src={chatUser.avatar} />
                )}
              </ListItemAvatar>
              <ListItemText 
                primary={
                  <Typography 
                    variant="subtitle2" 
                    component="span" 
                    fontWeight={chatUser.unreadCount ? "bold" : "regular"}
                  >
                    {chatUser.username}
                  </Typography>
                }
                secondary={
                  <Typography 
                    variant="body2" 
                    noWrap 
                    color="text.secondary" 
                    sx={{ 
                      maxWidth: '200px',
                      fontWeight: chatUser.unreadCount ? "medium" : "regular"
                    }}
                  >
                    {chatUser.lastMessage}
                  </Typography>
                }
              />
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'flex-end',
                  ml: 1,
                  minWidth: 45
                }}
              >
                {chatUser.lastMessageTime && (
                  <Typography variant="caption" color="text.secondary">
                    {formatTime(chatUser.lastMessageTime)}
                  </Typography>
                )}
                {!!chatUser.unreadCount && (
                  <Badge 
                    badgeContent={chatUser.unreadCount} 
                    color="primary" 
                    sx={{ mt: 0.5 }}
                  />
                )}
              </Box>
            </ListItem>
          ))
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No users found
            </Typography>
          </Box>
        )}
      </List>
    </Paper>
  );
  
  // Empty chat state component
  const EmptyChatState = () => (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100%',
        p: 3
      }}
    >
      <Avatar sx={{ width: 100, height: 100, mb: 3, bgcolor: 'primary.light' }}>
        <SendIcon sx={{ fontSize: 50, color: 'primary.main' }} />
      </Avatar>
      <Typography variant="h5" gutterBottom>
        Welcome to Connectt
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center">
        Select a chat from the left to start messaging
      </Typography>
    </Box>
  );

  // Chat area component
  const ChatArea = () => {
    // Group messages by date
    const groupedMessages: { [date: string]: Message[] } = {};
    
    if (selectedChat) {
      messages.forEach(message => {
        const dateKey = formatMessageDate(message.timestamp);
        if (!groupedMessages[dateKey]) {
          groupedMessages[dateKey] = [];
        }
        groupedMessages[dateKey].push(message);
      });
    }
    
    return (
      <Paper 
        elevation={0} 
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
          color="default" 
          elevation={0}
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            bgcolor: 'background.paper' 
          }}
        >
          <Toolbar sx={{ px: 2 }}>
            {isMobile && (
              <IconButton 
                edge="start" 
                color="inherit" 
                aria-label="back to list" 
                onClick={handleBackToList}
                sx={{ mr: 1 }}
              >
                <ArrowBackIcon />
              </IconButton>
            )}
            
            {selectedChat ? (
              <>
                {selectedChat.isOnline ? (
                  <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                  >
                    <Avatar alt={selectedChat.username} src={selectedChat.avatar} />
                  </StyledBadge>
                ) : (
                  <Avatar alt={selectedChat.username} src={selectedChat.avatar} />
                )}
                
                <Box sx={{ ml: 2, flexGrow: 1 }}>
                  <Typography variant="subtitle1" component="div">
                    {selectedChat.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedChat.isOnline ? 'Online' : 'Offline'}
                  </Typography>
                </Box>
                
                <IconButton color="primary" aria-label="phone call">
                  <PhoneIcon />
                </IconButton>
                <IconButton color="primary" aria-label="video call">
                  <VideoIcon />
                </IconButton>
                <IconButton 
                  edge="end" 
                  color="inherit" 
                  aria-label="more options"
                  onClick={handleMenuClick}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleMenuClose}>View Profile</MenuItem>
                  <MenuItem onClick={handleMenuClose}>Clear Chat</MenuItem>
                  <MenuItem onClick={handleMenuClose}>Block User</MenuItem>
                </Menu>
              </>
            ) : isMobile ? (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            ) : null}
          </Toolbar>
        </AppBar>
        
        {/* Chat messages */}
        {selectedChat ? (
          <>
            <Box 
              sx={{ 
                flexGrow: 1, 
                overflow: 'auto',
                p: 2,
                bgcolor: '#f5f5f5'
              }}
            >
              {Object.keys(groupedMessages).map(date => (
                <Box key={date}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      my: 2 
                    }}
                  >
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        bgcolor: 'rgba(0, 0, 0, 0.04)', 
                        px: 2, 
                        py: 0.5, 
                        borderRadius: 4 
                      }}
                    >
                      {date}
                    </Typography>
                  </Box>
                  
                  {groupedMessages[date].map((message) => {
                    const isCurrentUser = message.sender === user.username || message.sender === 'current';
                    
                    return (
                      <Box
                        key={message.id}
                        sx={{
                          display: 'flex',
                          justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: isCurrentUser ? 'row-reverse' : 'row',
                            alignItems: 'flex-end',
                            maxWidth: '75%',
                          }}
                        >
                          {!isCurrentUser && (
                            <Avatar 
                              alt={selectedChat.username} 
                              src={selectedChat.avatar}
                              sx={{ width: 32, height: 32, ml: isCurrentUser ? 1 : 0, mr: isCurrentUser ? 0 : 1 }}
                            />
                          )}
                          
                          <Box
                            sx={{
                              bgcolor: isCurrentUser ? 'primary.main' : 'background.paper',
                              color: isCurrentUser ? 'primary.contrastText' : 'text.primary',
                              borderRadius: 2,
                              p: 2,
                              boxShadow: 1,
                              ml: isCurrentUser ? 1 : 0,
                              mr: isCurrentUser ? 0 : 1,
                              position: 'relative'
                            }}
                          >
                            <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                              {message.text}
                            </Typography>
                            <Box 
                              sx={{ 
                                display: 'flex', 
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                mt: 0.5
                              }}
                            >
                              <Typography variant="caption" color={isCurrentUser ? 'primary.light' : 'text.secondary'}>
                                {formatTime(message.timestamp)}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              ))}
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
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton color="primary" aria-label="attach file">
                  <AttachFileIcon />
                </IconButton>
                <TextField
                  fullWidth
                  placeholder="Type a message..."
                  variant="outlined"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  sx={{ mx: 1 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton color="primary">
                          <EmojiIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <IconButton 
                  color="primary" 
                  aria-label="send message"
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim()}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </Box>
          </>
        ) : (
          <EmptyChatState />
        )}
      </Paper>
    );
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flexGrow: 1, display: 'flex' }}>
        {/* Users list - hide on mobile when chat is selected */}
        {(!isMobile || !selectedChat) && (
          <Box 
            sx={{ 
              width: isMobile ? '100%' : 320, 
              display: isMobile && selectedChat ? 'none' : 'block'
            }}
          >
            <UsersList />
          </Box>
        )}
        
        {/* Chat area - show on mobile only when chat is selected */}
        <Box 
          sx={{ 
            flexGrow: 1, 
            display: (!isMobile || selectedChat) ? 'block' : 'none'
          }}
        >
          <ChatArea />
        </Box>
      </Box>
    </Box>
  );
};

export default ChattingPage;