import React from "react";
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import ROUTES, { SecondaryRoutes, ThirdRoutes } from "@common/const/routes";
import MainLayout from "@components/layouts/mainLayout";
import PopuLayout from "@components/layouts/popuLayout";
import { inject, observer } from "mobx-react";
const ThirdRoutesMap = new Map();
ThirdRoutes.forEach((element) => {
  ThirdRoutesMap.set(element.mapPath, element);
});
const Routers = (props) => {
  const { server } = props;
  function renderRoutes(list = ROUTES) {
    return list.map((item) => {
      const props = {
        path: item.path,
        // component: item.component,
        exact: true,
        render: () => {
          return item.component;
        },
      };
      // 有子节点
      if (item.children && item.children.length) {
        return [
          ...renderRoutes(item.children),
          <Route key={item.path} {...props} />,
        ];
      }
      return <Route key={item.path} {...props} />;
    });
  }

  return (
    <Router>
      <Route
        render={({ location }) => {
          let popuLocation = null;
          let pathname = location.pathname;
          const thirdRoute = ThirdRoutesMap.get(pathname);
          if (thirdRoute) {
            popuLocation = {
              ...location,
            };
            location = {
              ...location,
              pathname: thirdRoute.parentPath,
            };
          }
          console.log("location ===> ", location);

          return (
            <>
              <MainLayout>
                <Switch location={location}>
                  {renderRoutes()}
                  {renderRoutes(SecondaryRoutes)}
                  <Redirect to="/" />
                </Switch>
              </MainLayout>
              {popuLocation && (
                <PopuLayout>
                  <Switch location={popuLocation}>
                    {renderRoutes(ThirdRoutes)}
                    <Redirect to="/" />
                  </Switch>
                </PopuLayout>
              )}
            </>
          );
        }}
      />
    </Router>
  );
};

export default inject("server")(observer(Routers));
