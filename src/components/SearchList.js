import css from "styled-jsx/css";

import { white, getColor } from "../colors";
import { getSpacing, BaseRadius } from "../styles-variables";

const ITEM_COLOR = "#727d7b";

const style = css`
  .SearchList {
    list-style: none;
    padding: 0;
    margin: 0;
    margin-bottom: ${getSpacing("m")}px;
  }

  .SearchListItem {
    padding: ${getSpacing("s")}px;
    /* margin-bottom: 1px; */
    cursor: pointer;

    background-color: ${white};
    color: ${ITEM_COLOR};
  }

  .SearchListItem:first-child {
    border-radius: ${BaseRadius}px ${BaseRadius}px 0 0;
  }

  .SearchListItem:last-child {
    border-radius: 0 0 ${BaseRadius}px ${BaseRadius}px;
  }

  .SearchListItem:only-child {
    border-radius: ${BaseRadius}px;
  }

  .SearchListItem--highlight {
    background-color: ${ITEM_COLOR};
    color: ${white};
  }

  .SearchListItem:hover {
    background-color: ${getColor("lightGrey", "tonic")};
  }
`;

const SearchList = ({ children, data, onClick }) => {
  if (!data.length) return null;

  return (
    <ul className={"SearchList"}>
      {data.map((datum, i) => (
        <li key={i} className={`SearchListItem`} onClick={() => onClick(datum)}>
          {children(datum)}
        </li>
      ))}
      <style jsx>{style}</style>
    </ul>
  );
};

export default SearchList;
