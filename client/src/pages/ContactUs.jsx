import { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Grid2, Box, Divider, Link } from '@mui/material';
import { Email, Phone, LocationOn } from '@mui/icons-material';

// Formatted using GPT
const ContactUs = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission logic here (send data to backend)
        setSubmitSuccess(true);
    };

    return (
        <Container maxWidth="md" sx={{ paddingY: 4 }}>
            <Paper
                elevation={3}
                sx={{
                    padding: { xs: 3, sm: 5 },
                    borderRadius: 2,
                    backgroundColor: "#f9f9f9",
                    boxShadow: 3,
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}
            >
                {/* Contact Us Header */}
                <Typography
                    variant="h4"
                    component="h1"
                    align="center"
                    gutterBottom
                    sx={{ fontWeight: "bold", color: "#004d40" }}
                >
                    Contact Us
                </Typography>

                {/* Contact Us Intro */}
                <Typography variant="body1" sx={{ color: "#333", marginBottom: 2, textAlign: 'center' }}>
                    Have a question, comment, or need support? We're here to help. Reach out to us, and we’ll get back to you as soon as possible.
                </Typography>

                <Divider sx={{ marginY: 3 }} />

                {/* Contact Form */}
                <form onSubmit={handleSubmit}>
                    <Grid2 container spacing={3}>
                        <Grid2 item xs={12} sm={6}>
                            <TextField
                                label="Your Name"
                                fullWidth
                                required
                                variant="outlined"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </Grid2>
                        <Grid2 item xs={12} sm={6}>
                            <TextField
                                label="Your Email"
                                fullWidth
                                required
                                variant="outlined"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </Grid2>
                        <Grid2 item xs={12}>
                            <TextField
                                label="Your Message"
                                fullWidth
                                required
                                variant="outlined"
                                multiline
                                rows={4}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            />
                        </Grid2>
                    </Grid2>

                    <Box sx={{ marginTop: 3, display: 'flex', justifyContent: 'center' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                backgroundColor: "#004d40",
                                color: "#fff",
                                '&:hover': { backgroundColor: "#00332e" }
                            }}
                        >
                            Send Message
                        </Button>
                    </Box>
                </form>

                {/* Submission Success Message */}
                {submitSuccess && (
                    <Typography sx={{ color: 'green', textAlign: 'center', marginTop: 3 }}>
                        Your message has been sent successfully! We will get back to you shortly.
                    </Typography>
                )}

                <Divider sx={{ marginY: 3 }} />

                {/* Contact Information */}
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#004d40" }}>
                    Our Office
                </Typography>
                <Typography sx={{ color: "#333", marginBottom: 2 }}>
                    If you'd rather reach out to us through other means, here are our contact details:
                </Typography>
                <Grid2 container spacing={2}>
                    <Grid2 item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocationOn sx={{ color: '#004d40', marginRight: 2 }} />
                            <Typography sx={{ color: "#333" }}>
                                Golisano Hall, Rochester Institute of Technology, NY 14623
                            </Typography>
                        </Box>
                    </Grid2>
                    <Grid2 item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Phone sx={{ color: '#004d40', marginRight: 2 }} />
                            <Typography sx={{ color: "#333" }}>+1 (555) 123-4567</Typography>
                        </Box>
                    </Grid2>
                    <Grid2 item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Email sx={{ color: '#004d40', marginRight: 2 }} />
                            <Typography sx={{ color: "#333" }}>aardvark_support@gmail.com</Typography>
                        </Box>
                    </Grid2>
                </Grid2>

                <Divider sx={{ marginY: 3 }} />

                {/* Social Media Links */}
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#004d40" }}>
                    Follow Us
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
                    <Link href="#" target="_blank" underline="hover">
                        <Typography sx={{ color: "#004d40" }}>Facebook</Typography>
                    </Link>
                    <Link href="#" target="_blank" underline="hover">
                        <Typography sx={{ color: "#004d40" }}>Twitter</Typography>
                    </Link>
                    <Link href="#" target="_blank" underline="hover">
                        <Typography sx={{ color: "#004d40" }}>Instagram</Typography>
                    </Link>
                </Box>
            </Paper>
        </Container>
    );
};

export { ContactUs };
