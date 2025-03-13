
/**
 * Functional component representing a button.
 * This component renders a button with an image icon. When clicked, it triggers the onClick event
 * provided through props.
 * @function Button
 * @param {Object} props - The props for the Button component.
 * @property {string} props.src - The source URL of the image icon.
 * @property {string} props.alt - The alternative text for the image icon.
 * @property {function} props.onClick - The function to be called when the button is clicked.
 * @returns {JSX.Element} A button element with an image icon.
 */
export function Button({ className, src, alt, onClick }) {
  const handleClick = () => {
    onClick();
  };

  return (
    <div className={`Button ${className || ""}`} onClick={handleClick}>
      <img
        src={`${process.env.PUBLIC_URL}${src}`}
        alt={alt}
      />
    </div>
  );
}