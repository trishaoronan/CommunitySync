import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Image,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface TeamMember {
  name: string;
  role: string;
  email: string;
  image: any;
}

const AboutScreen = () => {
  const router = useRouter();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleBackPress = () => {
    router.back();
  };

  const handleMemberPress = (member: TeamMember) => {
    setSelectedMember(member);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMember(null);
  };

  const developmentTeam = [
    {
      name: 'Stephanie Dulay',
      role: 'Project Leader',
      email: 'stephaniedulay37@gmail.com',
      image: require('../assets/pics/tepay.png'),
    },
    {
      name: 'Patricia Mariz Bantog',
      role: 'Front-End Developer',
      email: 'patriciamarizbantog@iskolarngbayan.pup.edu.ph',
      image: require('../assets/pics/pat.png'),
    },
    {
      name: 'Trisha Marie Oronan',
      role: 'Front-End Developer',
      email: 'trishamarietoronan@iskolarngbayan.pup.edu.ph',
      image: require('../assets/pics/3sha.png'),
    },
    {
      name: 'Ericka Orbasido',
      role: 'Back-End Developer',
      email: 'erickaorbasido@iskolarngbayan.pup.edu.ph',
      image: require('../assets/pics/ekang.png'),
    },
    {
      name: 'Shaznay Einallem Eubra',
      role: 'Back-End Developer',
      email: 'shaznayeinallemfeubra@iskolarngbayan.pup.edu.ph',
      image: require('../assets/pics/shandy.png'),
    },
    {
      name: 'Angelyn Panesa',
      role: 'QA / Tester',
      email: 'panesaangelyn13@gmail.com',
      image: require('../assets/pics/anglyn.png'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Content Card */}
      <View style={styles.cardContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          style={styles.scrollView}
        >
          {/* App Details */}
          <View style={styles.section}>
            <Text style={styles.appName}>CommunitySync</Text>
            <Text style={styles.versionText}>Version 1.0.0</Text>
            <Text style={styles.descriptionText}>
              Building innovative digital solutions for better community service
            </Text>
          </View>

          {/* About Our Group */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About Our Group</Text>
            <Text style={styles.sectionText}>
              We are a dedicated team of Bachelor of Science in Information Technology (BSIT)
              students from Polytechnic University of the Philippines – Sta. Maria Campus,
              committed to transforming barangay services through innovative technology. Our
              project, eBarangay for Pulong Buhangin Sta. Maria Bulacan, is a digital platform
              committed to transforming barangay services through innovative technology. Guided
              by our passion for community service and innovation, we aim to make barangay
              operations more efficient, transparent, and accessible—bridging the gap between
              people and technology for a smarter local governance system.
            </Text>
          </View>

          {/* Our Mission */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Our Mission</Text>
            <Text style={styles.sectionText}>
              Our mission is to develop a secure and user-friendly digital platform that
              simplifies barangay operations and improves access to government services for the
              residents of Pulong Buhangin. Through eBarangay, we aim to promote efficiency,
              reduce manual processes, and empower citizens with a more transparent and
              responsive local administration.
            </Text>
          </View>

          {/* Our Vision */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Our Vision</Text>
            <Text style={styles.sectionText}>
              We envision a digitally empowered Philippines where every barangay embraces
              technology for smarter, faster, and more citizen-centered governance. eBarangay
              strives to be a model of innovation and transparency, inspiring collaboration among
              students, developers, and local leaders to bring government services closer to the
              people.
            </Text>
          </View>

          {/* Core Values */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Core Values</Text>
            <View style={styles.coreValuesContainer}>
              <View style={styles.valueTag}>
                <Text style={styles.valueTagText}>Innovation</Text>
              </View>
              <View style={styles.valueTag}>
                <Text style={styles.valueTagText}>Excellence</Text>
              </View>
              <View style={styles.valueTag}>
                <Text style={styles.valueTagText}>Transparency</Text>
              </View>
              <View style={styles.valueTag}>
                <Text style={styles.valueTagText}>Community Service</Text>
              </View>
              <View style={styles.valueTag}>
                <Text style={styles.valueTagText}>Collaboration</Text>
              </View>
            </View>
          </View>

          {/* Technologies */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technologies</Text>
            <View style={styles.techContainer}>
              <View style={styles.techTag}>
                <Text style={styles.techTagText}>React Native</Text>
              </View>
              <View style={styles.techTag}>
                <Text style={styles.techTagText}>React</Text>
              </View>
              <View style={styles.techTag}>
                <Text style={styles.techTagText}>Supabase</Text>
              </View>
              <View style={styles.techTag}>
                <Text style={styles.techTagText}>Supabase Edge</Text>
              </View>
              <View style={styles.techTag}>
                <Text style={styles.techTagText}>Visual Studio Code</Text>
              </View>
            </View>
          </View>

          {/* About CommunitySync */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About CommunitySync</Text>
            <Text style={styles.sectionText}>
              CommunitySync is an innovative web-based system designed to digitize and streamline
              barangay operations. It allows residents to conveniently request documents, track
              approvals, and access essential barangay services online. Our goal is to promote
              transparency, efficiency, and accessibility in local governance through technology.
            </Text>
          </View>

          {/* Our Purpose */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Our Purpose</Text>
            <Text style={styles.sectionText}>
              We created CommunitySync to address the common challenges faced by barangay
              residents and staff, such as long waiting times, manual paperwork, and lack of
              service tracking. By introducing an online platform, we aim to make barangay
              services faster, more reliable, and easier for everyone.
            </Text>
          </View>

          {/* Our Development Journey */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Our Development Journey</Text>
            <Text style={styles.sectionText}>
              The CommunitySync System was developed as part of our BSIT program project. From
              brainstorming to coding, our team collaborated to bring a system that reflects our
              passion for community service and innovation. Each member contributed their
              technical expertise and creativity to ensure a smooth, user-friendly experience.
            </Text>
          </View>

          {/* Development Team */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Our Development Team</Text>
            <Text style={styles.teamSubtitle}>
              PUP Santa Maria BSIT Students - 4th Year Information Technology
            </Text>

            <View style={styles.teamGrid}>
              {developmentTeam.map((member, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.teamMemberCard}
                  onPress={() => handleMemberPress(member)}
                  activeOpacity={0.7}
                >
                  <Image source={member.image} style={styles.teamMemberImage} />
                  <Text style={styles.teamMemberName}>{member.name}</Text>
                  <Text style={styles.teamMemberRole}>{member.role}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Future Plans */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Future Plans</Text>
            <Text style={styles.sectionText}>
              We plan to expand eBarangay by integrating more features such as resident feedback
              forms, enhanced mobile responsiveness, and analytics for barangay officials to
              improve decision-making. Our vision includes implementing real-time notifications,
              digital payment integration, and multi-language support to serve our diverse
              community better.
            </Text>
          </View>

          {/* Acknowledgement */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Acknowledgement</Text>
            <View style={styles.acknowledgementContainer}>
              <Image
                source={require('../assets/pics/sir-philip.png')}
                style={styles.advisorImage}
              />
              <View style={styles.advisorInfo}>
                <Text style={styles.advisorName}>Mr. Philip Lorenz Sarmiento</Text>
                <Text style={styles.advisorRole}>Project Adviser</Text>
              </View>
            </View>
            <Text style={styles.acknowledgementText}>
              We would like to thank our project adviser, Mr. Philip Lorenz Sarmiento, for his
              guidance and support throughout the development of CommunitySync.
            </Text>
          </View>

          {/* Core Values */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Core Values</Text>
            <View style={styles.coreValuesContainer}>
              <View style={styles.valueTag}>
                <Text style={styles.valueTagText}>Innovation</Text>
              </View>
              <View style={styles.valueTag}>
                <Text style={styles.valueTagText}>Transparency</Text>
              </View>
              <View style={styles.valueTag}>
                <Text style={styles.valueTagText}>Community Service</Text>
              </View>
              <View style={styles.valueTag}>
                <Text style={styles.valueTagText}>Reliability</Text>
              </View>
            </View>
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>
      </View>

      {/* Footer Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.backButton2}
          onPress={handleBackPress}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>Back to Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Team Member Details Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedMember && (
              <>
                {/* Close Button */}
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={handleCloseModal}
                >
                  <MaterialIcons name="close" size={28} color="#333" />
                </TouchableOpacity>

                {/* Member Image */}
                <Image
                  source={selectedMember.image}
                  style={styles.modalMemberImage}
                />

                {/* Member Details */}
                <Text style={styles.modalMemberName}>{selectedMember.name}</Text>
                <Text style={styles.modalMemberRole}>{selectedMember.role}</Text>

                {/* Email Section */}
                <View style={styles.emailContainer}>
                  <MaterialIcons name="email" size={20} color="#0a7ea4" />
                  <Text style={styles.emailText}>{selectedMember.email}</Text>
                </View>

                {/* Close Modal Button */}
                <TouchableOpacity
                  style={styles.modalCloseButtonText}
                  onPress={handleCloseModal}
                >
                  <Text style={styles.closeButtonText}>Done</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  cardContainer: {
    flex: 1,
    marginHorizontal: 12,
    marginVertical: 8,
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0a7ea4',
    textAlign: 'center',
    marginBottom: 4,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0a7ea4',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
  },
  teamSubtitle: {
    fontSize: 11,
    color: '#999',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  teamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  teamMemberCard: {
    width: '31%',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
  },
  teamMemberImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 4,
    borderWidth: 2,
    borderColor: '#0a7ea4',
  },
  teamMemberName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 2,
  },
  teamMemberRole: {
    fontSize: 9,
    color: '#999',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 30,
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalMemberImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#0a7ea4',
  },
  modalMemberName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 6,
  },
  modalMemberRole: {
    fontSize: 14,
    color: '#0a7ea4',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#0a7ea4',
  },
  emailText: {
    fontSize: 12,
    color: '#0a7ea4',
    marginLeft: 8,
    fontWeight: '500',
    flex: 1,
  },
  modalCloseButtonText: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 10,
    width: '100%',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  acknowledgementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  advisorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#0a7ea4',
  },
  advisorInfo: {
    flex: 1,
  },
  advisorName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333',
    marginBottom: 2,
  },
  advisorRole: {
    fontSize: 10,
    color: '#999',
  },
  acknowledgementText: {
    fontSize: 11,
    color: '#666',
    lineHeight: 16,
    marginTop: 6,
  },
  coreValuesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  valueTag: {
    backgroundColor: '#0a7ea4',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 4,
  },
  valueTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFF',
  },
  techContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  techTag: {
    backgroundColor: '#FFD700',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 4,
  },
  techTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton2: {
    backgroundColor: '#FFD700',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default AboutScreen;
