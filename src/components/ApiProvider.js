import { compose } from "redux";

import withEventAPI from "../components/withEventAPI";
import withCredentials from "../components/withCredentials";

const ApiContext = React.createContext();

const ApiProvider = ({ children, api }) => (
  <ApiContext.Provider value={{ api }}>{children}</ApiContext.Provider>
);

const ApiConsumer = ApiContext.Consumer;

export default compose(
  withCredentials,
  withEventAPI
)(ApiProvider);

export { ApiConsumer };
