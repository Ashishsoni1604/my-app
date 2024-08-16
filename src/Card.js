import React from "react";

const Card = ({data}) => {
  const { title, by } = data;
  return (
    <div style={{border: "1px solid gray", padding: "10px", width: "500px"}}>
      <strong>{title}</strong>
      by {by}
    </div>
  );
};

export default Card;
