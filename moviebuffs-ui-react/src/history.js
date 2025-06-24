// Custom history object to navigate outside of components
// This is a workaround since React Router v6 no longer includes history directly

let navigate = null;

export const history = {
  navigate: (to) => {
    if (navigate) {
      navigate(to);
    } else {
      console.warn("Navigation attempted before history was initialized");
    }
  },
  setNavigate: (navigateFunc) => {
    navigate = navigateFunc;
  }
};
