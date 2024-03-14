import { useContext, useEffect, useRef, useState } from "react";

import Paper from "@mui/material/Paper";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

import NewTicketModal from "../NewTicketModal";
import TicketsList from "../TicketsList";
import TabPanel from "../TabPanel";

import { i18n } from "../../translate/i18n";
import { AuthContext } from "../../context/Auth/AuthContext";
import { Can } from "../Can";
import TicketsQueueSelect from "../TicketsQueueSelect";
import { Button, Divider } from "@mui/material";
import { styled } from '@mui/system';

const TicketsWrapper = styled(Paper)({
  position: 'relative',
  display: 'flex',
  height: '100%',
  flexDirection: 'column',
  overflow: 'hidden',
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
});


const TabsHeader = styled(Paper)({
  flex: 'none',
  // backgroundColor: '#eee',
});

// const SettingsIcon = styled('div')({
//   alignSelf: 'center',
//   marginLeft: 'auto',
//   padding: 8,
// });

const TabStyled = styled(Tab)({
  minWidth: 120,
  width: 120,
});

const TicketOptionsBox = styled("div")({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: 'rgb(80, 80, 80)',
  padding: '8px', // Adjust this according to your requirement
});

const SearchInputWrapper = styled('div')({
  flex: 1,
  display: 'flex',
  borderRadius: 40,
  padding: 4,
  marginRight: '8px', // Adjust this according to your requirement
});

const SearchIconStyled = styled(SearchIcon)({
  color: 'grey',
  marginLeft: 6,
  marginRight: 6,
  alignSelf: 'center',
});

const SearchInput = styled(InputBase)({
  flex: 1,
  border: 'none',
  borderRadius: 30,
});

const BadgeStyled = styled('span')({
  right: '-10px',
});

// const Show = styled('div')({
//   display: 'block',
// });

// const Hide = styled('div')({
//   display: 'none !important',
// });

const TicketsManager = () => {

  const [searchParam, setSearchParam] = useState("");
  const [tab, setTab] = useState("open");
  const [tabOpen, setTabOpen] = useState("open");
  const [newTicketModalOpen, setNewTicketModalOpen] = useState(false);
  const [showAllTickets, setShowAllTickets] = useState(false);
  const searchInputRef = useRef();
  const { user } = useContext(AuthContext);

  const [openCount, setOpenCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  const userQueueIds = user.queues.map((q) => q.id);
  const [selectedQueueIds, setSelectedQueueIds] = useState(userQueueIds || []);

  useEffect(() => {
    if (user.profile.toUpperCase() === "ADMIN") {
      setShowAllTickets(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tab === "search") {
      searchInputRef.current.focus();
      setSearchParam("");
    }
  }, [tab]);

  let searchTimeout;

  const handleSearch = (e) => {
    const searchedTerm = e.target.value.toLowerCase();

    clearTimeout(searchTimeout);

    if (searchedTerm === "") {
      setSearchParam(searchedTerm);
      setTab("open");
      return;
    }

    searchTimeout = setTimeout(() => {
      setSearchParam(searchedTerm);
    }, 500);
  };

  const handleChangeTab = (e, newValue) => {
    setTab(newValue);
  };

  const handleChangeTabOpen = (e, newValue) => {
    setTabOpen(newValue);
  };

  const applyPanelStyle = (status) => {
    if (tabOpen !== status) {
      return { width: 0, height: 0 };
    }
  };

  return (
    <TicketsWrapper elevation={0} variant="outlined">
      <NewTicketModal
        modalOpen={newTicketModalOpen}
        onClose={() => setNewTicketModalOpen(false)}
      />
      <TabsHeader elevation={0} square >
        <Tabs
          value={tab}
          onChange={handleChangeTab}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          style={{ backgroundColor: "rgb(80, 80, 80)" }}
          aria-label="icon label tabs example"
        >
          <TabStyled
            value={"open"}
            icon={<MoveToInboxIcon />}
            label={i18n.t("tickets.tabs.open.title")}

          />
          <TabStyled
            value={"closed"}
            icon={<CheckBoxIcon />}
            label={i18n.t("tickets.tabs.closed.title")}

          />
          <Tab
            value={"search"}
            icon={<SearchIcon />}
            label={i18n.t("tickets.tabs.search.title")}
          />
        </Tabs>
      </TabsHeader>
      <Divider />
      <Divider />
      <Divider />
      <TicketOptionsBox square elevation={0} >
        {tab === "search" ? (
          <SearchInputWrapper>
            <SearchIconStyled />
            <SearchInput
              inputRef={searchInputRef}
              placeholder={i18n.t("tickets.search.placeholder")}
              type="search"
              onChange={handleSearch}
            />
          </SearchInputWrapper>
        ) : (
          <>
            <Button
              variant="outlined"
              onClick={() => setNewTicketModalOpen(true)}
            >
              {i18n.t("ticketsManager.buttons.newTicket")}
            </Button>
            <Can
              role={user.profile}
              perform="tickets-manager:showall"
              yes={() => (
                <FormControlLabel
                  label={i18n.t("tickets.buttons.showAll")}
                  labelPlacement="start"
                  control={
                    <Switch
                      size="small"
                      checked={showAllTickets}
                      onChange={() =>
                        setShowAllTickets((prevState) => !prevState)
                      }
                      name="showAllTickets"
                      color="primary"
                    />
                  }
                />
              )}
            />
          </>
        )}
        <TicketsQueueSelect
          style={{ marginLeft: 6 }}
          selectedQueueIds={selectedQueueIds}
          userQueues={user?.queues}
          onChange={(values) => setSelectedQueueIds(values)}
        />
      </TicketOptionsBox>
      <TabPanel value={tab} name="open" >
        <Tabs
          value={tabOpen}
          onChange={handleChangeTabOpen}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab
            label={
              <BadgeStyled
                badgeContent={openCount}
                color="primary"
              >
                {i18n.t("ticketsList.assignedHeader")}
              </BadgeStyled>
            }
            value={"open"}
          />
          <Tab
            label={
              <BadgeStyled
                badgeContent={pendingCount}
                color="primary"
              >
                {i18n.t("ticketsList.pendingHeader")}
              </BadgeStyled>
            }
            value={"pending"}
          />
        </Tabs>
        <TicketsWrapper>
          <TicketsList
            status="open"
            showAll={showAllTickets}
            selectedQueueIds={selectedQueueIds}
            updateCount={(val) => setOpenCount(val)}
            style={applyPanelStyle("open")}
          />
          <TicketsList
            status="pending"
            selectedQueueIds={selectedQueueIds}
            updateCount={(val) => setPendingCount(val)}
            style={applyPanelStyle("pending")}
          />
        </TicketsWrapper>
      </TabPanel>
      <TabPanel value={tab} name="closed" >
        <TicketsList
          status="closed"
          showAll={true}
          selectedQueueIds={selectedQueueIds}
        />
      </TabPanel>
      <TabPanel value={tab} name="search">
        <TicketsList
          searchParam={searchParam}
          showAll={true}
          selectedQueueIds={selectedQueueIds}
        />
      </TabPanel>
    </TicketsWrapper >
  );
};

export default TicketsManager;
