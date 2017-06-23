const isClassComponent = Component =>
  Boolean(
    Component &&
      Component.prototype &&
      typeof Component.prototype.isReactComponent === 'object'
  );

const isReferentiallyTransparentFunctionComponent = Component =>
  Boolean(
    typeof Component === 'function' &&
      !isClassComponent(Component) &&
      !Component.defaultProps &&
      !Component.contextTypes &&
      !Component.propTypes
  );

export default isReferentiallyTransparentFunctionComponent;
