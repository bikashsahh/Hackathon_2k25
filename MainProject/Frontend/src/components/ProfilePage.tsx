import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import {
  FaFilePdf,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaBuilding,
  FaStar,
} from "react-icons/fa";
import { mockProfile } from "../services/profileService";
// import { fetchUserProfile } from "../services/profileService";
import { useParams } from "react-router-dom";
import { UserProfile } from "../types/profile";

const ProfileContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  min-height: 90vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
  max-width: 100%;
  margin: 0 auto;

  //   border: 2px solid red;
`;

const ProfileHeader = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  text-align: center;
`;

const ProfileImage = styled(motion.img)`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    width: 180px;
    height: 180px;
  }
`;

const ProfileName = styled(motion.h1)`
  font-size: 2rem;
  color: #333;
  margin: 0;
  font-weight: 700;
  background: linear-gradient(to right, #4285f4, #34a853);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
`;

const ProfileStatus = styled(motion.div)<{ status: string }>`
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  margin-top: 1rem;
  font-size: 0.9rem;
  background-color: ${(props) => {
    switch (props.status) {
      case "Hired":
        return "#34a85320";
      case "Rejected":
        return "#ea433520";
      case "Interviewed":
        return "#fbbc0520";
      case "Shortlisted":
        return "#4285f420";
      default:
        return "#f5f5f5";
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case "Hired":
        return "#34a853";
      case "Rejected":
        return "#ea4335";
      case "Interviewed":
        return "#fbbc05";
      case "Shortlisted":
        return "#4285f4";
      default:
        return "#666";
    }
  }};
`;

const ProfileContent = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 992px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ProfileCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
`;

const CardTitle = styled(motion.h2)`
  font-size: 1.25rem;
  color: #4285f4;
  margin-top: 0;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 576px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const InfoItem = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`;

const InfoIcon = styled.div`
  color: #4285f4;
  font-size: 1.1rem;
  margin-top: 0.2rem;
`;

const InfoContent = styled.div``;

const InfoLabel = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.2rem;
`;

const InfoValue = styled.div`
  font-weight: 500;
  color: #333;
`;

const SkillsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const SkillTag = styled(motion.span)`
  background: #4285f410;
  color: #4285f4;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const ATSBadge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  background: linear-gradient(135deg, #4285f410, #34a85310);
  color: #333;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  margin-top: 1rem;
  gap: 0.5rem;
`;

const ResumeButton = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #4285f4;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  margin-top: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: #3367d6;
    transform: translateY(-2px);
  }
`;

const ProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        // In production, use:
        // const data = await fetchUserProfile(userId!);
        // For demo, using mock data:
        const data = mockProfile;
        setProfile(data);
      } catch (err) {
        setError("Failed to load profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profile) {
    return <div>No profile found</div>;
  }

  return (
    <ProfileContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ProfileHeader>
        <ProfileImage
          src={profile.imageUrl}
          alt={profile.name}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 10 }}
        />
        <ProfileName
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {profile.name}
        </ProfileName>
        <ProfileStatus
          status={profile.status}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {profile.status}
        </ProfileStatus>
      </ProfileHeader>

      <ProfileContent>
        <ProfileCard
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <CardTitle
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <FaEnvelope /> Contact Information
          </CardTitle>

          <InfoGrid>
            <InfoItem
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <InfoIcon>
                <FaEnvelope />
              </InfoIcon>
              <InfoContent>
                <InfoLabel>Email</InfoLabel>
                <InfoValue>{profile.email}</InfoValue>
              </InfoContent>
            </InfoItem>

            <InfoItem
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
            >
              <InfoIcon>
                <FaPhone />
              </InfoIcon>
              <InfoContent>
                <InfoLabel>Phone</InfoLabel>
                <InfoValue>{profile.phone || "Not provided"}</InfoValue>
              </InfoContent>
            </InfoItem>

            <InfoItem
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <InfoIcon>
                <FaMapMarkerAlt />
              </InfoIcon>
              <InfoContent>
                <InfoLabel>Location</InfoLabel>
                <InfoValue>{profile.location || "Not provided"}</InfoValue>
              </InfoContent>
            </InfoItem>

            <InfoItem
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
            >
              <InfoIcon>
                <FaBuilding />
              </InfoIcon>
              <InfoContent>
                <InfoLabel>Current Company</InfoLabel>
                <InfoValue>
                  {profile.currentCompany || "Not provided"}
                </InfoValue>
              </InfoContent>
            </InfoItem>
          </InfoGrid>
        </ProfileCard>

        <ProfileCard
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <CardTitle
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            <FaStar /> Application Details
          </CardTitle>

          <InfoGrid>
            <InfoItem
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
            >
              <InfoContent>
                <InfoLabel>Applied Date</InfoLabel>
                <InfoValue>
                  {new Date(profile.appliedDate).toLocaleDateString()}
                </InfoValue>
              </InfoContent>
            </InfoItem>

            <InfoItem
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <InfoContent>
                <InfoLabel>Last Updated</InfoLabel>
                <InfoValue>
                  {new Date(profile.lastUpdated).toLocaleDateString()}
                </InfoValue>
              </InfoContent>
            </InfoItem>

            <InfoItem
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
            >
              <InfoContent>
                <InfoLabel>Experience</InfoLabel>
                <InfoValue>{profile.experience} years</InfoValue>
              </InfoContent>
            </InfoItem>
          </InfoGrid>

          <ATSBadge
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <FaStar color="#fbbc05" />
            ATS Score: {profile.atsScore}/100
          </ATSBadge>

          <div>
            <CardTitle
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ marginBottom: "1rem" }}
            >
              Skills
            </CardTitle>
            <SkillsContainer>
              {profile.skills.map((skill, index) => (
                <SkillTag
                  key={skill}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                >
                  {skill}
                </SkillTag>
              ))}
            </SkillsContainer>
          </div>

          <ResumeButton
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaFilePdf /> View Resume
          </ResumeButton>
        </ProfileCard>
      </ProfileContent>
    </ProfileContainer>
  );
};

export default ProfilePage;
