import React from 'react';
import { Container, Paper, Typography, Link, Divider } from "@mui/material";

const PrivacyPolicy = () => {
    return (
        <Container maxWidth="md" sx={{ paddingY: 4 }}>
            <Paper
                elevation={3}
                sx={{
                    padding: { xs: 3, sm: 5 },
                    borderRadius: 2,
                    backgroundColor: "#f9f9f9",
                    boxShadow: 3
                }}
            >
                <Typography
                    variant="h4"
                    component="h1"
                    align="center"
                    gutterBottom
                    sx={{ fontWeight: "bold", color: "#004d40" }}
                >
                    Privacy Policy
                </Typography>

                <Typography variant="body1" paragraph sx={{ color: "#333" }}>
                    Last Updated: April 08, 2025
                </Typography>

                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#004d40" }}>
                    Introduction
                </Typography>
                <Typography paragraph sx={{ color: "#333" }}>
                    Aardvark Games ("we", "our", or "us") is committed to protecting and respecting your privacy. This Privacy Policy outlines the types of personal data we collect, how we use it, and your rights regarding the information we collect. By using our website and services, you consent to the collection and use of your information as described in this policy. 
                </Typography>
                <Typography paragraph sx={{ color: "#333" }}>
                    If you have any questions or concerns about this policy or our privacy practices, please feel free to contact us through our{" "}
                    <Link href="/contact" underline="hover">Contact Page</Link>.
                </Typography>

                <Divider sx={{ marginY: 3 }} />

                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#004d40" }}>
                    Information We Collect
                </Typography>
                <Typography paragraph sx={{ color: "#333" }}>
                    We may collect the following types of personal information from you:
                </Typography>
                <ul>
                    <li>Name and contact information (including email address)</li>
                    <li>Demographic information (e.g., college enrollment, age, gender, etc.)</li>
                    <li>Game-related data (e.g., player bio, tournament history, team affiliation)</li>
                    <li>Billing and payment information (if applicable)</li>
                    <li>Other information relevant to contests, surveys, or promotional activities</li>
                </ul>

                <Divider sx={{ marginY: 3 }} />

                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#004d40" }}>
                    How We Use Your Information
                </Typography>
                <Typography paragraph sx={{ color: "#333" }}>
                    We collect your personal information for the following purposes:
                </Typography>
                <ul>
                    <li>To execute and facilitate international game tournaments.</li>
                    <li>To communicate with you regarding your participation in tournaments, events, or promotional offers.</li>
                    <li>To improve and customize our products, services, and website.</li>
                    <li>To send promotional emails about new products, special offers, and other information we think you may find interesting.</li>
                    <li>To conduct market research and analyze website usage to enhance user experience.</li>
                    <li>To comply with legal and regulatory obligations.</li>
                </ul>
                <Typography paragraph sx={{ color: "#333" }}>
                    We will never sell, rent, or trade your personal data to third parties for marketing purposes without your explicit consent.
                </Typography>

                <Divider sx={{ marginY: 3 }} />

                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#004d40" }}>
                    Security of Your Information
                </Typography>
                <Typography paragraph sx={{ color: "#333" }}>
                    We take the security of your personal data seriously. We implement a range of physical, electronic, and managerial security measures to safeguard your information from unauthorized access, disclosure, or destruction. Despite our efforts to secure your data, no method of transmission over the internet or electronic storage is completely secure. 
                </Typography>
                <Typography paragraph sx={{ color: "#333" }}>
                    If you believe that your information has been compromised, please contact us immediately at our{" "}
                    <Link href="/contact" underline="hover">Contact Page</Link>.
                </Typography>

                <Divider sx={{ marginY: 3 }} />

                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#004d40" }}>
                    Cookies and Tracking Technologies
                </Typography>
                <Typography paragraph sx={{ color: "#333" }}>
                    We use cookies and similar tracking technologies to enhance your user experience on our website. Cookies are small files placed on your device that help us analyze web traffic, remember your preferences, and personalize your experience.
                </Typography>
                <Typography paragraph sx={{ color: "#333" }}>
                    We use cookies to:
                </Typography>
                <ul>
                    <li>Monitor and analyze website traffic and usage.</li>
                    <li>Personalize the content you see and your user experience.</li>
                    <li>Maintain and improve the functionality of the website.</li>
                </ul>
                <Typography paragraph sx={{ color: "#333" }}>
                    You can choose to accept or decline cookies by adjusting your browser settings. Please note that if you disable cookies, some features of the website may not function as intended. For more details on how we use cookies, please visit our <Link href="/cookie-policy" underline="hover">Cookie Policy</Link>.
                </Typography>

                <Divider sx={{ marginY: 3 }} />

                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#004d40" }}>
                    Links to Third-Party Websites
                </Typography>
                <Typography paragraph sx={{ color: "#333" }}>
                    Our website may contain links to third-party websites that are not operated or controlled by us. We are not responsible for the content or privacy practices of these websites. We encourage you to review the privacy policies of any third-party sites before providing them with any personal information.
                </Typography>
                <Typography paragraph sx={{ color: "#333" }}>
                    By using our website, you acknowledge and agree that we are not responsible for the privacy practices of third-party sites.
                </Typography>

                <Divider sx={{ marginY: 3 }} />

                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#004d40" }}>
                    Your Data Protection Rights
                </Typography>
                <Typography paragraph sx={{ color: "#333" }}>
                    Under applicable data protection laws, you have the right to access, correct, or delete your personal information. If you wish to exercise any of these rights, please contact us using the information provided below.
                </Typography>
                <ul>
                    <li><strong>Access:</strong> You can request a copy of the personal data we hold about you.</li>
                    <li><strong>Correction:</strong> You can request corrections to any inaccurate or incomplete data.</li>
                    <li><strong>Deletion:</strong> You can request the deletion of your personal information, subject to certain exceptions.</li>
                    <li><strong>Restriction:</strong> You can request restrictions on how we process your data.</li>
                    <li><strong>Objection:</strong> You can object to the processing of your personal data for specific purposes.</li>
                </ul>
                <Typography paragraph sx={{ color: "#333" }}>
                    To exercise your rights, please contact us through our{" "}
                    <Link href="/contact" underline="hover">Contact Page</Link>.
                </Typography>

                <Divider sx={{ marginY: 3 }} />

                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#004d40" }}>
                    Changes to This Privacy Policy
                </Typography>
                <Typography paragraph sx={{ color: "#333" }}>
                    We may update this privacy policy periodically to reflect changes in our practices or for other operational, legal, or regulatory reasons. When we make changes, we will update the "Last Updated" date at the top of this page.
                </Typography>
                <Typography paragraph sx={{ color: "#333" }}>
                    We encourage you to review this policy regularly to stay informed about how we protect your personal information.
                </Typography>

                <Divider sx={{ marginY: 3 }} />

                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#004d40" }}>
                    Contact Us
                </Typography>
                <Typography paragraph sx={{ color: "#333" }}>
                    If you have any questions about this privacy policy, or if you wish to exercise your data protection rights, please contact us via our{" "}
                    <Link href="/contact" underline="hover">Contact Page</Link>.
                </Typography>
            </Paper>
        </Container>
    );
};

export {PrivacyPolicy};
