import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import Card from "./Card";

const fetchData = async (id) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  return fetch(
    `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`,
    {
      headers: myHeaders,
    }
  ).then((res) => res.json());
}

export const useIntersection = (element, rootMargin) => {
  const [isVisible, setState] = useState(false);

  useEffect(() => {
    const current = element?.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setState(entry.isIntersecting);
      },
      { rootMargin }
    );
    current && observer?.observe(current);

    return () => current && observer.unobserve(current);
  }, []);

  return isVisible;
};
function App() {
  const [newsIds, setNewsIds] = useState([]);
  const [data, setData] = useState([])
  const ref = useRef(null);
  const isVisible = useIntersection(ref, "0px");
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    fetch(
      "https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty",
      {
        headers: myHeaders,
      }
    ).then((res) => res.json().then((data) => setNewsIds(data)));
  }, []);

  useEffect(() => {
    if (isVisible && newsIds.length && !isLoading) {
      setPage((p) => p + 1);
      const filteredIds = newsIds.slice((page) * 10, (page + 1) * 10);
      setIsLoading(true)
      Promise.all(filteredIds.map(async (id) => fetchData(id))).then((newData) => {
        setData([...data, ...newData])
        setIsLoading(false)
      })
    }
  }, [isVisible, newsIds]);

  
  return (
    <div className="App">
      <div style={{ display: "grid", gap: "10px", justifyContent: "center" }}>
        {data.map((r, index) => (
          <Card data={r} key={index} />
        ))}
      </div>
      {<div ref={ref} />}
      {<img src={logo} className="App-logo" alt="logo" />}
    </div>
  );
}

export default App;
