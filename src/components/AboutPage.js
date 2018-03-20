import { getSpacing } from '../styles-variables';

const AboutPage = () => (
  <div className={'AboutPage'}>
    <h1>{'À propos de La Foulée'}</h1>
    <div className={'AboutPage-content'}>
      {`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque venenatis posuere nulla nec faucibus. Ut sodales pharetra dui ac porttitor. Maecenas venenatis finibus massa, sit amet consequat libero aliquet eget. Morbi sollicitudin venenatis diam eu tempus. Aliquam dignissim, nisl eget dignissim sodales, justo ante vehicula ipsum, interdum eleifend arcu felis ac felis. Aenean non magna tincidunt, bibendum nunc sit amet, hendrerit turpis. Etiam id vulputate metus. Vivamus dictum sed mauris vel ullamcorper. Donec vulputate consectetur ex, ac sagittis mauris ultrices a. Suspendisse a tortor lectus. Cras tristique tortor elementum orci consectetur elementum. Maecenas ligula risus, bibendum eu rhoncus in, viverra a diam.

Curabitur et diam tempus, tempus nulla in, tempor neque. Morbi id libero lobortis, euismod velit in, ultrices nunc. In ante massa, pharetra in velit at, eleifend vehicula nisl. Fusce diam nulla, auctor ac tincidunt at, blandit nec lacus. Phasellus tristique maximus cursus. Morbi mi mauris, vestibulum ut elit auctor, luctus hendrerit dui. Integer ac augue sapien. Proin ac turpis tempus justo sodales pellentesque non sed urna. Sed sit amet ipsum eget metus varius cursus. Pellentesque vulputate arcu metus, eu sagittis libero tempus elementum. Cras pharetra felis est, et condimentum enim pharetra id. Nulla convallis lectus magna, eu dictum ex efficitur id. Maecenas elementum tincidunt semper.`}
    </div>
    <style jsx>{`
      .AboutPage {
        padding: ${getSpacing('m')}px;
      }
    `}</style>
  </div>
);

export default AboutPage;
