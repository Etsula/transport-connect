
import { Card } from "@/components/ui/card";

const Accessibility = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Accessibility</h1>
        
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Our Commitment to Accessibility</h2>
          <p className="mb-4">
            iShip is committed to ensuring our application is accessible to all users, including those with disabilities. 
            We strive to comply with the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.
          </p>

          <h2 className="text-xl font-bold mb-4 mt-6">Accessibility Features</h2>
          <p className="mb-2">Our application includes the following accessibility features:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Semantic HTML to ensure proper screen reader navigation</li>
            <li>Keyboard navigation support throughout the application</li>
            <li>Sufficient color contrast for text and interactive elements</li>
            <li>Text alternatives for non-text content</li>
            <li>Resizable text without loss of functionality</li>
            <li>Clear focus indicators for interactive elements</li>
          </ul>

          <h2 className="text-xl font-bold mb-4 mt-6">Assistive Technology Compatibility</h2>
          <p className="mb-4">
            iShip is designed to work with a variety of assistive technologies, including:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Screen readers (like VoiceOver, TalkBack, NVDA, and JAWS)</li>
            <li>Screen magnifiers</li>
            <li>Voice recognition software</li>
            <li>Alternative input devices</li>
          </ul>

          <h2 className="text-xl font-bold mb-4 mt-6">Ongoing Improvements</h2>
          <p className="mb-4">
            We continually assess and improve our application's accessibility. Our development process includes 
            accessibility testing throughout the design and implementation phases.
          </p>

          <h2 className="text-xl font-bold mb-4 mt-6">Feedback</h2>
          <p className="mb-4">
            If you encounter any accessibility barriers while using iShip, or if you have suggestions for improving 
            our accessibility, please contact us at accessibility@iship.com. We welcome your feedback.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Accessibility;
