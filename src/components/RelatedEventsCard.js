import css from "styled-jsx/css";
import Link from "next/link";
import moment from "moment";

import { getSpacing } from "../styles-variables";
import { white, getColor } from "../colors";

const IMAGE_CARD_DESKTOP_WIDTH = 200;
const IMAGE_CARD_DESKTOP_HEIGHT = 125;
const DATE_FORMAT_DESKTOP = "DD MMMM";
const DATE_FORMAT_MOBILE = "DD MMM";
const IMAGE_CARD_MOBILE_WIDTH = 120;
// From RelatedEvents-CardBody: 24 * 3 (h6 on 2lines + span) + 24 * 2 (card body padding)
const IMAGE_CARD_HEIGHT = 120;

const style = css`
  .RelatedEvents-CardLinkWrapper {
    text-decoration: none;
    color: inherit;
  }

  .RelatedEvents-Card {
    margin-top: ${getSpacing("m")}px;
    display: flex;
    background-color: ${white};
    box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.1);
  }

  .RelatedEvents-CardImage {
    height: ${IMAGE_CARD_HEIGHT}px;
    flex-shrink: 0;
    background: #eeedf2;
  }

  .RelatedEvents-Image {
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
  }

  .RelatedEvents-CardBody {
    display: flex;
    flex-direction: column;
    justify-content: center;

    flex-shrink: 1;
    width: 100%;
    padding: ${getSpacing("m")}px ${getSpacing("s")}px;
  }

  .RelatedEvents-CardBody > h6 {
    margin: 0;
  }

  .RelatedEvents-CardBody > span {
    color: ${getColor("darkGrey", "tonic")};
  }
`;

const RelatedEventsCard = ({ query, as, image, title, desktop }) => (
  <Link
    href={{
      pathname: "/events",
      query
    }}
    as={as}
  >
    <a className={"RelatedEvents-CardLinkWrapper"}>
      <div className={"RelatedEvents-Card"}>
        <div className={"RelatedEvents-CardImage"}>
          <img src={image} className={"RelatedEvents-Image"} />
        </div>
        <div className={"RelatedEvents-CardBody"}>
          <div>{query.depCode ? "Département" : "Autour de"}</div>
          <h6>{title}</h6>
          <span>{`À partir du ${moment().format(
            desktop ? DATE_FORMAT_DESKTOP : DATE_FORMAT_MOBILE
          )}`}</span>
        </div>
      </div>
      <style jsx>{style}</style>
      <style jsx>{`
        .RelatedEvents-CardImage {
          width: ${desktop
            ? IMAGE_CARD_DESKTOP_WIDTH
            : IMAGE_CARD_MOBILE_WIDTH}px;
        }
      `}</style>
    </a>
  </Link>
);

export default RelatedEventsCard;
