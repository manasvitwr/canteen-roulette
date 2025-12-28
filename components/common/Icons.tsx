
import React from 'react';

// Keep the existing stroke-based icons
export const HomeIcon: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

export const SearchIcon: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

// SVG-based icons using inline SVG with currentColor for proper theming
export const OrdersIcon: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" className={className}>
    <path d="M25,15H7c0-4.42,3.58-8,8-8h2c4.42,0,8,3.58,8,8Z" fill="none" />
    <path d="M30,14h-4.059c-.4842-4.3558-4.0892-7.7736-8.5226-7.9788-.2018-.5902-.7552-1.0173-1.4135-1.0173h-.0098c-.6582,0-1.2085,.4269-1.4091,1.0171-4.4355,.2033-8.0426,3.6218-8.527,7.979H2c-.5527,0-1,.4478-1,1s.4473,1,1,1h1.2797l.316,.9487c.4092,1.2271,1.5527,2.0513,2.8457,2.0513h3.0853l1.8824,2.4648c.1309,.1714,.3135,.2959,.5205,.355,.126,.0356,3.0498,.8574,7.3936,1.1006l2.3049,2.1502-.1653,.0949c-.4785,.2749-.6445,.8862-.3691,1.3652,.1846,.3218,.5215,.502,.8682,.502,.1689,0,.3398-.0425,.4971-.1328l6.3457-3.644c.4785-.2749,.6445-.8862,.3691-1.3652-.2754-.4785-.8857-.645-1.3652-.3691l-.1553,.0892c-.4365-.932-1.0585-1.8801-1.6201-2.6483,1.0916-.1739,2.0128-.9393,2.3711-2.0141l.316-.9482h1.2797c.5527,0,1-.4478,1-1s-.4473-1-1-1Zm-15-6h2c3.519,0,6.4323,2.6134,6.9202,6H8.0799c.4879-3.3866,3.4011-6,6.9201-6Zm8.4432,16.0283l-3.0214-2.8188c-.1738-.1616-.3984-.2568-.6357-.2681-3.5-.1655-6.125-.749-6.9961-.9644l-.7463-.9771h11.4841c.6821,.8267,1.8297,2.3546,2.3835,3.611l-2.4681,1.4174Zm3.0646-7.7124c-.1367,.4092-.5186,.6841-.9492,.6841H6.4414c-.4307,0-.8125-.2749-.9492-.6836l-.1054-.3164H26.6131l-.1053,.3159Z" />
  </svg>
);

export const BagIcon: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <img
    src="/assets/icons/bag.svg"
    alt=""
    className={className}
    style={{
      filter: 'brightness(0) saturate(100%) invert(var(--icon-invert, 0))',
      opacity: 'var(--icon-opacity, 1)'
    }}
  />
);

export const ProfileIcon: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <g stroke="none" strokeWidth="1" fillRule="evenodd" transform="scale(0.9) translate(1, 1)">
      <g transform="translate(-140.000000, -2159.000000)">
        <g transform="translate(56.000000, 160.000000)">
          <path d="M100.562548,2016.99998 L87.4381713,2016.99998 C86.7317804,2016.99998 86.2101535,2016.30298 86.4765813,2015.66198 C87.7127655,2012.69798 90.6169306,2010.99998 93.9998492,2010.99998 C97.3837885,2010.99998 100.287954,2012.69798 101.524138,2015.66198 C101.790566,2016.30298 101.268939,2016.99998 100.562548,2016.99998 M89.9166645,2004.99998 C89.9166645,2002.79398 91.7489936,2000.99998 93.9998492,2000.99998 C96.2517256,2000.99998 98.0830339,2002.79398 98.0830339,2004.99998 C98.0830339,2007.20598 96.2517256,2008.99998 93.9998492,2008.99998 C91.7489936,2008.99998 89.9166645,2007.20598 89.9166645,2004.99998 M103.955674,2016.63598 C103.213556,2013.27698 100.892265,2010.79798 97.837022,2009.67298 C99.4560048,2008.39598 100.400241,2006.33098 100.053171,2004.06998 C99.6509769,2001.44698 97.4235996,1999.34798 94.7348224,1999.04198 C91.0232075,1998.61898 87.8750721,2001.44898 87.8750721,2004.99998 C87.8750721,2006.88998 88.7692896,2008.57398 90.1636971,2009.67298 C87.1074334,2010.79798 84.7871636,2013.27698 84.044024,2016.63598 C83.7745338,2017.85698 84.7789973,2018.99998 86.0539717,2018.99998 L101.945727,2018.99998 C103.221722,2018.99998 104.226185,2017.85698 103.955674,2016.63598" />
        </g>
      </g>
    </g>
  </svg>
);

export const CanteenIcon: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <img
    src="/assets/icons/canteen.svg"
    alt=""
    className={className}
    style={{
      filter: 'brightness(0) saturate(100%) invert(var(--icon-invert, 0))',
      opacity: 'var(--icon-opacity, 1)'
    }}
  />
);

export const HostelIcon: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <img
    src="/assets/icons/hostel.svg"
    alt=""
    className={className}
    style={{
      filter: 'brightness(0) saturate(100%) invert(var(--icon-invert, 0))',
      opacity: 'var(--icon-opacity, 1)'
    }}
  />
);

export const MaggiIcon: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <img
    src="/assets/icons/maggi.svg"
    alt=""
    className={className}
    style={{
      filter: 'brightness(0) saturate(100%) invert(var(--icon-invert, 0))',
      opacity: 'var(--icon-opacity, 1)'
    }}
  />
);

export const CafeIcon: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <img
    src="/assets/icons/cafe.svg"
    alt=""
    className={className}
    style={{
      filter: 'brightness(0) saturate(100%) invert(var(--icon-invert, 0))',
      opacity: 'var(--icon-opacity, 1)'
    }}
  />
);
