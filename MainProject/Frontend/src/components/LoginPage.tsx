import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { googleClientId } from "../config/auth";
import styled from "@emotion/styled";
import { FaRobot } from "react-icons/fa";
import { useSpring, animated, config } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  justify-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 1rem;
  overflow: hidden;

  //   border: 5px solid red;
  //   overflow: hidden;
`;

const AnimatedBackground = styled(animated.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 80%;
  height: 97%;
  background: radial-gradient(circle at 75% 50%, #4285f433 0%, transparent 30%),
    radial-gradient(circle at 25% 80%, #34a85333 0%, transparent 30%),
    radial-gradient(circle at 50% 20%, #fbbc0533 0%, transparent 30%);
  z-index: 0;

  //   border: 5px solid green;
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  z-index: 1;
  text-align: center;

  @media (min-width: 768px) {
    flex-direction: row;
    text-align: left;
  }
`;

const RobotIcon = styled(animated(FaRobot))`
  font-size: 4rem;
  color: #4285f4;
  margin-right: 1rem;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));

  @media (min-width: 768px) {
    font-size: 5rem;
  }
`;

const LogoText = styled(animated.h1)`
  font-size: 2.5rem;
  color: #333;
  margin: 0;
  font-weight: 700;
  background: linear-gradient(to right, #4285f4, #34a853, #fbbc05, #ea4335);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (min-width: 768px) {
    font-size: 3rem;
  }
`;

const Tagline = styled(animated.p)`
  font-size: 1rem;
  color: #666;
  margin-top: 0.5rem;
  font-style: italic;

  @media (min-width: 768px) {
    font-size: 1.2rem;
  }
`;

const LoginCard = styled(animated.div)`
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 400px;
  text-align: center;
  backdrop-filter: blur(10px);
  z-index: 1;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to bottom right,
      rgba(66, 133, 244, 0.1) 0%,
      rgba(66, 133, 244, 0) 50%,
      rgba(234, 67, 53, 0.1) 100%
    );
    transform: rotate(30deg);
    z-index: -1;
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  position: relative;

  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid #eee;
  }
`;

const DividerText = styled.span`
  padding: 0 1rem;
  color: #999;
  font-size: 0.875rem;
  background: white;
  position: relative;
  z-index: 1;
`;

const GoogleButtonContainer = styled(motion.div)`
  width: 100%;
`;

const HireBotsExplanation = styled(animated.div)`
  margin-top: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #555;
  border-left: 4px solid #4285f4;

  strong {
    color: #4285f4;
  }
`;

const ParticlesContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
`;

const Particle = styled(animated.div)`
  // position: absolute;
  // background: rgba(66, 133, 244, 0.6);
  // border-radius: 50%;
`;

const LoginPage = () => {
  // Background animation
  const [bgStyles, bgApi] = useSpring(() => ({
    from: { transform: "scale(1.2)" },
    to: { transform: "scale(1)" },
    config: config.slow,
  }));

  // Card drag animation
  const [cardStyles, cardApi] = useSpring(() => ({
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
    config: config.gentle,
  }));

  const bind = useDrag(({ down, movement: [mx, my] }) => {
    cardApi.start({
      x: down ? mx : 0,
      y: down ? my : 0,
      rotate: down ? mx * 0.1 : 0,
      scale: down ? 1.02 : 1,
      immediate: down,
    });
  });

  // Logo animations
  const [logoStyles, logoApi] = useSpring(() => ({
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0 },
    delay: 200,
  }));

  const [robotStyles] = useSpring(() => ({
    from: { rotate: -30 },
    to: { rotate: 0 },
    delay: 300,
    config: config.wobbly,
  }));

  // Particles animation
  const [particles, setParticles] = useState<
    Array<{ id: number; styles: Record<string, unknown> }>
  >([]);

  useEffect(() => {
    // Create particles
    const newParticles = Array.from({ length: 15 }).map((_, i) => {
      const size = Math.random() * 10 + 5;
      return {
        id: i,
        styles: {
          width: `${size}px`,
          height: `${size}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          opacity: 0,
          background: `rgba(${Math.floor(Math.random() * 100 + 156)},
                      ${Math.floor(Math.random() * 100 + 156)},
                      ${Math.floor(Math.random() * 100 + 156)},
                      ${Math.random() * 0.4 + 0.2})`,
        },
      };
    });

    setParticles(newParticles);

    // Animate particles in
    setTimeout(() => {
      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          styles: {
            ...(p.styles as Record<string, unknown>),
            opacity: 1,
            x: (Math.random() - 0.5) * 100,
            y: (Math.random() - 0.5) * 100,
          },
        }))
      );
    }, 500);

    // Background parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      bgApi.start({
        transform: `scale(1.05) translate(${x * 20}px, ${y * 20}px)`,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSuccess = (
    credentialResponse: google.accounts.id.CredentialResponse
  ) => {
    console.log("Login Success:", credentialResponse);
    // Add success animation
    logoApi.start({
      from: { opacity: 1, y: 0 },
      to: [
        { opacity: 1, y: -10 },
        { opacity: 1, y: 0 },
      ],
      config: config.wobbly,
    });
  };

  const handleError = () => {
    console.log("Login Failed");
    // Add error shake animation
    cardApi.start({
      from: { x: 0 },
      to: [{ x: 10 }, { x: -10 }, { x: 5 }, { x: -5 }, { x: 0 }],
      config: config.stiff,
    });
  };

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <LoginContainer>
        <AnimatedBackground style={bgStyles} />

        <ParticlesContainer>
          {particles.map((particle) => (
            <Particle
              key={particle.id}
              style={{
                ...particle.styles,
                transform: particle.styles.x
                  ? `translate(${particle.styles.x}px, ${particle.styles.y}px)`
                  : undefined,
              }}
            />
          ))}
        </ParticlesContainer>

        <LogoContainer>
          <RobotIcon style={robotStyles} />
          <div style={logoStyles}>
            <LogoText>HireBots</LogoText>
            <Tagline>Bot Oriented Tech Solution</Tagline>
          </div>
        </LogoContainer>

        <LoginCard style={cardStyles} {...bind()}>
          <h2 style={{ marginBottom: "0.5rem", color: "black" }}>
            Welcome to HireBots
          </h2>
          <p style={{ marginBottom: "1.5rem", color: "#666" }}>
            Sign in to access your dashboard
          </p>

          <Divider>
            <DividerText>Continue with</DividerText>
          </Divider>

          <GoogleButtonContainer
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              shape="pill"
              size="large"
              text="continue_with"
              theme="filled_blue"
              logo_alignment="left"
            />
          </GoogleButtonContainer>

          <HireBotsExplanation
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <strong>HireBots</strong> stands for{" "}
            <strong>Bot Oriented Tech Solution</strong> - our platform provides
            intelligent automation solutions for your Hiring needs.
          </HireBotsExplanation>
        </LoginCard>
      </LoginContainer>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
