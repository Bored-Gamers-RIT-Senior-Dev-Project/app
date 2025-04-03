import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
  Container
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";

const faqs = [
  {
    question: "Can I buy the game now?",
    answer: (
      <>
        You can sign up for our pre-order list on{" "}
        <Link href="/about" underline="hover">
          the Game page
        </Link>.
      </>
    ),
  },
  {
    question: "I don’t see my university listed. Can I still play?",
    answer: (
      <>
        Yes! When we see a new school listed, we contact them to initiate
        tournament activity. Please{" "}
        <Link href="/signup" underline="hover">
          sign up
        </Link>{" "}
        and get your friends involved ASAP!
      </>
    ),
  },
  {
    question:
      "Do I get my money back if my college doesn’t have playoff rounds?",
    answer:
      "Yes, those fees are refundable. However, if there are competitions played at nearby schools, you will first be invited to join a team there.",
  },
  {
    question:
      "What if our team can’t afford to travel to the final playoff location?",
    answer: "Aardvark Games will be paying all travel costs.",
  },
  {
    question: "I’m taking a break from college, can I play?",
    answer: "No, only current students may enter.",
  },
];

const Faq = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ paddingY: 4 }}>
      <Paper
        elevation={3}
        sx={{
          padding: { xs: 2, sm: 4 },
          borderRadius: 2,
          backgroundColor: "#f9f9f9",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Frequently Asked Questions
        </Typography>

        {faqs.map((faq, index) => (
          <Accordion key={index} sx={{ marginY: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>
    </Container>
  );
};

export { Faq };
