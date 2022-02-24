import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilesState {
  fileGroupList: { parentId: string; fileItems: any[] }[];
}

const initialState: FilesState = {
  fileGroupList: [],
};

const filesSlice = createSlice({
  name: 'filesSlice',
  initialState,
  reducers: {
    addFileGroup: (state, { payload }: PayloadAction<{ fileItems: any[]; parentId: string }>) => {
      const indexOfFileGroup = state.fileGroupList.findIndex((group) => group.parentId === payload.parentId);
      if (indexOfFileGroup < 0) {
        const fileGroup = { parentId: payload.parentId, fileItems: payload.fileItems };
        state.fileGroupList.push(fileGroup);
        return;
      }
      state.fileGroupList[indexOfFileGroup].fileItems = payload.fileItems;
    },
    addOneFileItem: (state, { payload }: PayloadAction<{ fileItem: any; parentId: string }>) => {
      const indexOfFileGroup = state.fileGroupList.findIndex((group) => group.parentId === payload.parentId);
      state.fileGroupList[indexOfFileGroup].fileItems.push(payload.fileItem);
    },
    updateFileItem: (state, { payload }: PayloadAction<{ fileItem: any; parentId: string }>) => {
      const indexOfFileGroup = state.fileGroupList.findIndex((group) => group.parentId === payload.parentId);
      const indexOfFileItem = state.fileGroupList[indexOfFileGroup].fileItems.findIndex(
        (item) => item.id === payload.fileItem.id,
      );
      state.fileGroupList[indexOfFileGroup].fileItems[indexOfFileItem] = payload.fileItem;
    },
    removeFileItem: (state, { payload }: PayloadAction<{ fileItem: any; parentId: string }>) => {
      const indexOfFileGroup = state.fileGroupList.findIndex((group) => group.parentId === payload.parentId);
      const indexOfFileItem = state.fileGroupList[indexOfFileGroup].fileItems.findIndex(
        (item) => item.id === payload.fileItem.id,
      );
      state.fileGroupList[indexOfFileGroup].fileItems.splice(indexOfFileItem, 1);
    },
  },
});

export const filesActions = filesSlice.actions;
export const filesReducer = filesSlice.reducer;
