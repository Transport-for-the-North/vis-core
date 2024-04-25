export function Button(props) {
    const handleClick = () => {
      props.onClick();
    };
  
    return (
      <>
        <div className="Button" onClick={handleClick}>
          <img
            src={`${process.env.PUBLIC_URL}${props.src}`}
            alt={props.alt}
          ></img>
        </div>
      </>
    );
  }