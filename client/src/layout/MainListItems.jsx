import { useContext, useEffect, useState, useMemo, forwardRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Divider,
  Badge,
  Tooltip,
} from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import SmartToyIcon from '@mui/icons-material/SmartToy';
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ContactPhoneOutlinedIcon from "@mui/icons-material/ContactPhoneOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";

import { i18n } from "../translate/i18n";
import { WhatsAppsContext } from "../context/WhatsApp/WhatsAppsContext";
import { AuthContext } from "../context/Auth/AuthContext";
import { Can } from "../components/Can";

function ListItemLink(props) {
  const { icon, primary, to, className } = props;

  const renderLink = useMemo(
    () =>
      // eslint-disable-next-line react/display-name
      forwardRef((itemProps, ref) => (
        <RouterLink to={to} ref={ref} {...itemProps} />
      )),
    [to]
  );

  return (

    <ListItem button component={renderLink} className={className}>
      {icon && <ListItemIcon>{icon}</ListItemIcon>}
      <ListItemText primary={primary} />
    </ListItem>
  );
}

const MainListItems = ({ drawerClose }) => {

  const { whatsApps } = useContext(WhatsAppsContext);
  const { user } = useContext(AuthContext);
  const [connectionWarning, setConnectionWarning] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (whatsApps.length > 0) {
        const offlineWhats = whatsApps.filter((whats) => {
          return (
            whats.status === "qrcode" ||
            whats.status === "PAIRING" ||
            whats.status === "DISCONNECTED" ||
            whats.status === "TIMEOUT" ||
            whats.status === "OPENING"
          );
        });
        if (offlineWhats.length > 0) {
          setConnectionWarning(true);
        } else {
          setConnectionWarning(false);
        }
      }
    }, 2000);
    return () => clearTimeout(delayDebounceFn);
  }, [whatsApps]);

  return (
    <>
      <div onClick={drawerClose}>
        <ListItemLink
          to="/"
          primary="Dashboard"
          icon={
            <Tooltip placement="right" title="Dashboard">
              <DashboardOutlinedIcon color="secondary" />
            </Tooltip>
          }
        />
        <ListItemLink
          to="/connections"
          primary={i18n.t("mainDrawer.listItems.connections")}
          icon={
            <Tooltip placement="right" title={i18n.t("mainDrawer.listItems.connections")}>
              <Badge badgeContent={connectionWarning ? "!" : 0} color="error">
                <SyncAltIcon color="secondary" />
              </Badge>
            </Tooltip>
          }
        />
        <ListItemLink
          to="/tickets"
          primary={i18n.t("mainDrawer.listItems.tickets")}
          icon={
            <Tooltip placement="right"
              title={i18n.t("mainDrawer.listItems.tickets")}
            >
              <WhatsAppIcon color="secondary" />
            </Tooltip>
          }
        />
        <ListItemLink
          to="/contacts"
          primary={i18n.t("mainDrawer.listItems.contacts")}
          icon={
            <Tooltip placement="right" title={i18n.t("mainDrawer.listItems.contacts")}>
              <ContactPhoneOutlinedIcon color="secondary" />
            </Tooltip>
          }
        />
        <ListItemLink
          to="/quickAnswers"
          primary={i18n.t("mainDrawer.listItems.quickAnswers")}
          icon={
            <Tooltip placement="right" title={i18n.t("mainDrawer.listItems.quickAnswers")}>
              <QuestionAnswerOutlinedIcon color="secondary" />
            </Tooltip>
          }

        />
        <Can
          role={user.profile}
          perform="drawer-admin-items:view"
          yes={() => (
            <>
              <Divider />
              <ListSubheader inset>
                {i18n.t("mainDrawer.listItems.administration")}
              </ListSubheader>
              <ListItemLink
                to="/users"
                primary={i18n.t("mainDrawer.listItems.users")}
                icon={
                  <Tooltip placement="right" title={i18n.t("mainDrawer.listItems.users")}>
                    <PeopleAltOutlinedIcon color="secondary" />
                  </Tooltip>
                }
              />
              <ListItemLink
                to="/queues"
                primary={i18n.t("mainDrawer.listItems.queues")}
                icon={
                  <Tooltip placement="right" title={i18n.t("mainDrawer.listItems.queues")}>
                    <AccountTreeOutlinedIcon color="secondary" />
                  </Tooltip>
                }
              />
              <ListItemLink
                to="/assistant"
                primary={i18n.t("mainDrawer.listItems.assistant")}
                icon={
                  <Tooltip placement="right" title={i18n.t("mainDrawer.listItems.assistant")}>
                    <SmartToyIcon color="secondary" />
                  </Tooltip>
                }
              />
              <ListItemLink
                to="/settings"
                primary={i18n.t("mainDrawer.listItems.settings")}
                icon={
                  <Tooltip placement="right"
                    title={i18n.t("mainDrawer.listItems.settings")}
                  >
                    <SettingsOutlinedIcon color="secondary" />
                  </Tooltip>
                }
              />
            </>
          )}
        />
      </div>
    </>
  );
};

export default MainListItems;
