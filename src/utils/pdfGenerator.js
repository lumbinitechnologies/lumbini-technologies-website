import { jsPDF } from "jspdf";

export const generateOfferLetter = (applicant) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Lumbini Technologies", 20, 20);

  doc.setFontSize(12);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 40);

  doc.text(`Dear ${applicant.name},`, 20, 60);

  doc.text(
    "We are pleased to offer you the position of Intern at Lumbini Technologies.",
    20,
    80,
  );

  doc.text(`Role: ${applicant.degree}`, 20, 100);
  doc.text(`Start Date: TBD`, 20, 110);
  doc.text(`Duration: 3 Months`, 20, 120);

  doc.text(
    "We look forward to working with you and hope this internship will be a valuable experience.",
    20,
    140,
  );

  doc.text("Sincerely,", 20, 170);
  doc.text("HR Team", 20, 180);
  doc.text("Lumbini Technologies", 20, 190);

  doc.save(`${applicant.name}_Offer_Letter.pdf`);
};

export const generateAgreement = (applicant) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Internship Agreement", 20, 20);

  doc.setFontSize(12);

  doc.text(
    `This agreement is between Lumbini Technologies and ${applicant.name}.`,
    20,
    50,
  );

  doc.text(
    "The intern agrees to work on assigned projects and maintain confidentiality.",
    20,
    70,
  );

  doc.text(`Intern Name: ${applicant.name}`, 20, 100);
  doc.text(`Email: ${applicant.email}`, 20, 110);
  doc.text(`University: ${applicant.university}`, 20, 120);

  doc.text("Duration: 3 Months", 20, 140);

  doc.text("Responsibilities:", 20, 160);
  doc.text("- Work on assigned projects", 30, 170);
  doc.text("- Attend weekly meetings", 30, 180);
  doc.text("- Submit progress reports", 30, 190);

  doc.text("Signed,", 20, 220);
  doc.text("Lumbini Technologies", 20, 230);

  doc.save(`${applicant.name}_Internship_Agreement.pdf`);
};
