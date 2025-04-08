export const getClientInfo = (req) => {
  const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const device = req.useragent.isMobile ? 'mobile' :
                 req.useragent.isTablet ? 'tablet' : 
                 req.useragent.isDesktop ? 'desktop' : 'other';
  const browser = req.useragent.browser;
  const operatingSystem = req.useragent.os;
  return {
    ipAddress,
    device,
    browser,
    operatingSystem,
  };
};
