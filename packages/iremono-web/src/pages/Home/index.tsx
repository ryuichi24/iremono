import React, { useState } from 'react';
import styled from 'styled-components';
import Box from '@mui/material/Box';
import { ResizablePanel } from '@/components/ResizablePanel';
import { useTheme } from '@mui/system';
import { Sidebar } from '@/components/Sidebar';
import { Activity } from '@/containers/Activity';
import { Explore } from '@/containers/Explore';

interface Props {
  user: any;
}

export const Home = ({ user }: Props) => {
  const [isSidebarPositionLeft, setsSidebarPositionLeft] = useState(true);
  const muiTheme = useTheme();

  return (
    <HomeContainer>
      <ResizablePanel defaultLeftSizeInRatio={isSidebarPositionLeft ? 15 : 85} resizerColor={muiTheme.palette.divider}>
        {isSidebarPositionLeft && (
          <SidePanel>
            <Sidebar>
              <Activity />
              <Explore />
            </Sidebar>
          </SidePanel>
        )}
        <MainPanelContainer>
          <ResizablePanel defaultLeftSizeInRatio={70} isVertical={true} resizerColor={muiTheme.palette.divider}>
            <MainTopPanel>
              <div>main top</div>
              {user.email}
            </MainTopPanel>
            <MainBottomPanel>
              <div>main bottom</div>
            </MainBottomPanel>
          </ResizablePanel>
        </MainPanelContainer>
        {!isSidebarPositionLeft && (
          <SidePanel>
            <Sidebar swap={true}>
              <Activity />
              <Explore />
            </Sidebar>
          </SidePanel>
        )}
      </ResizablePanel>
    </HomeContainer>
  );
};

const Panel = styled(Box)`
  width: 100%;
  height: 100%;
`;

const HomeContainer = styled(Panel)`
  display: flex;
`;

const MainPanelContainer = styled(Panel)``;

const MainTopPanel = styled(Panel)``;

const MainBottomPanel = styled(Panel)``;

const SidePanel = styled(Panel)``;
