const JSONLD = ({ data }) => (
  <script
    type={'application/ld+json'}
    dangerouslySetInnerHTML={{
      __html: data
    }}
  />
);

export default JSONLD;
