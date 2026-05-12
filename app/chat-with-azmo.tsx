import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface ChatMessage {
  id: string;
  sender: 'user' | 'azmo';
  text: string;
  timestamp: string;
}

const ChatWithAzmoScreen = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'azmo',
      text: "Hello! I'm Azmo, How can I help you today?",
      timestamp: '9:41 AM',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const handleBackPress = () => {
    router.back();
  };

  // Get smart response based on user question
  const getAzmoResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (
      lowerMessage.includes('what documents') ||
      lowerMessage.includes('documents can i request')
    ) {
      return 'You can request a Barangay Clearance, Certificate of Indigency, Barangay ID, Business Permit, Burial Assistance, Certificate of Residency, Good Moral, Solo Parent, Certificate of Low Income, No Derogatory, and Non Employment Certificate.';
    }

    if (
      lowerMessage.includes('how to request') ||
      lowerMessage.includes('request a document')
    ) {
      return 'I can help you with that! You can request the following documents directly through Home Page > Request Document';
    }

    if (
      lowerMessage.includes('where can i claim') ||
      lowerMessage.includes('claim my document')
    ) {
      return 'You can claim your documents at the Barangay Office during business hours (Monday-Friday, 8:00 AM - 5:00 PM), or check your Track Request page to see if it\'s available for pickup or download.';
    }

    if (
      lowerMessage.includes('payment') ||
      lowerMessage.includes('how much') ||
      lowerMessage.includes('fee')
    ) {
      return 'Document fees vary by type. Please send your payment to 09238412342 as indicated in the Mode of Release section. You can also contact our support team for a detailed fee list.';
    }

    if (
      lowerMessage.includes('track') ||
      lowerMessage.includes('status')
    ) {
      return 'You can track your request status anytime by going to Home Page > Track Request. It will show you if your document is Completed, Unpaid, or Pending.';
    }

    if (
      lowerMessage.includes('contact') ||
      lowerMessage.includes('support')
    ) {
      return 'You can reach us through Chat (available 24/7), Call us at +639238412342, or Email us at support@communitysync.com. We\'re here to help!';
    }

    if (
      lowerMessage.includes('requirement') ||
      lowerMessage.includes('need')
    ) {
      return 'Most documents require a valid ID and proof of residency. For specific requirements, please visit the Request Document page where each document has detailed requirements.';
    }

    // Default response
    return 'Thanks for your question! I\'m here to help. You can ask me about requesting documents, tracking your request, or anything else related to CommunitySync. What would you like to know? :)';
  };

  const handleSendMessage = (text: string) => {
    if (text.trim() === '') return;

    const newMessage: ChatMessage = {
      id: String(messages.length + 1),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // Auto-scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulate Azmo response with smart answers
    setTimeout(() => {
      const azmoResponse: ChatMessage = {
        id: String(messages.length + 2),
        sender: 'azmo',
        text: getAzmoResponse(text),
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prevMessages) => [...prevMessages, azmoResponse]);

      // Auto-scroll again
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 800);
  };

  const handleQuickTap = (text: string) => {
    handleSendMessage(text);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.sender === 'user';

    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.azmoMessageContainer,
        ]}
      >
        {!isUser && (
          <Image
            source={require('../assets/pics/chatbot.png')}
            style={styles.avatar}
            resizeMode="contain"
          />
        )}

        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.azmoBubble,
          ]}
        >
          <Text style={[styles.messageText, isUser ? styles.userText : styles.azmoText]}>
            {item.text}
          </Text>
        </View>

        {isUser && <View style={{ width: 40 }} />}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#E3F2FD', '#F0F4F8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Chat with Azmo</Text>
          <Text style={styles.headerSubtitle}>Helping you 24/7</Text>
        </View>
        <View style={{ width: 40 }} />
      </LinearGradient>

      {/* Chat Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />

      {/* Quick Action Buttons */}
      <View style={styles.quickActionsContainer}>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => handleQuickTap('How to request a document?')}
        >
          <Text style={styles.quickActionText}>How to request a document?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => handleQuickTap('Where can I claim my document?')}
        >
          <Text style={styles.quickActionText}>Where can I claim my document?</Text>
        </TouchableOpacity>
      </View>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Ask something"
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => handleSendMessage(inputText)}
          />
          <TouchableOpacity onPress={() => handleSendMessage(inputText)}>
            <MaterialIcons name="keyboard" size={20} color="#999" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: Math.max(12, width * 0.04),
    paddingVertical: Math.max(10, height * 0.015),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: Math.max(6, width * 0.02),
  },
  headerTitleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: Math.max(16, width * 0.05),
    fontWeight: 'bold',
    color: '#1A3A52',
  },
  headerSubtitle: {
    fontSize: Math.max(11, width * 0.03),
    color: '#999',
    marginTop: 2,
  },
  messagesList: {
    paddingHorizontal: Math.max(12, width * 0.04),
    paddingTop: Math.max(12, height * 0.02),
    paddingBottom: Math.max(8, height * 0.01),
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: Math.max(8, height * 0.01),
    alignItems: 'flex-end',
  },
  azmoMessageContainer: {
    justifyContent: 'flex-start',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: Math.max(32, width * 0.08),
    height: Math.max(32, width * 0.08),
    borderRadius: Math.max(16, width * 0.04),
    marginRight: Math.max(6, width * 0.02),
  },
  messageBubble: {
    maxWidth: Math.max(240, width * 0.75),
    paddingHorizontal: Math.max(12, width * 0.03),
    paddingVertical: Math.max(8, height * 0.01),
    borderRadius: 16,
  },
  azmoBubble: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#FFEB3B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: '#E8E8E8',
  },
  messageText: {
    fontSize: Math.max(13, width * 0.035),
    lineHeight: Math.max(16, width * 0.045),
  },
  azmoText: {
    color: '#333',
  },
  userText: {
    color: '#333',
  },
  quickActionsContainer: {
    paddingHorizontal: Math.max(12, width * 0.04),
    paddingBottom: Math.max(10, height * 0.015),
    gap: Math.max(6, width * 0.02),
  },
  quickActionButton: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: Math.max(14, width * 0.035),
    paddingVertical: Math.max(8, height * 0.01),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  quickActionText: {
    fontSize: Math.max(12, width * 0.032),
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  inputContainer: {
    paddingHorizontal: Math.max(12, width * 0.04),
    paddingVertical: Math.max(10, height * 0.015),
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    paddingHorizontal: Math.max(14, width * 0.035),
    paddingVertical: Math.max(8, height * 0.01),
  },
  input: {
    flex: 1,
    fontSize: Math.max(13, width * 0.034),
    color: '#333',
    marginRight: Math.max(6, width * 0.02),
  },
});

export default ChatWithAzmoScreen;
