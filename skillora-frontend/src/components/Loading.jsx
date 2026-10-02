const Loading = ({ text = "Loading..." }) => {
  return (
    <div className="loading-container">
      <div
        className="spinner-border"
        role="status"
      ></div>

      <p>{text}</p>
    </div>
  );
};

export default Loading;