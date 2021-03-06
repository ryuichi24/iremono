import React, { useState } from 'react';
// mui components
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
// action hooks
import { useFoldersActions } from '@/store/folders/use-folders-actions';
import { useFilesActions } from '@/store/files/use-files-actions';
// services
import { foldersService } from '@/services/folders-service';
import { filesService } from '@/services/files-service';

interface Props {
  storageItem: any;
  currentFolderId: string;
  open: boolean;
  handleClose: () => void;
}

export const RenameStorageItemForm = ({ storageItem, currentFolderId, open, handleClose }: Props) => {
  const [storageItemName, setStorageItemName] = useState(storageItem.name);

  const { updateFolderItem } = useFoldersActions();
  const { updateFileItem } = useFilesActions();

  const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    handleClose();

    storageItem.isFolder
      ? foldersService
          .update({ folderId: storageItem.id, folderProperties: { name: storageItemName } })
          .then((result) => {
            updateFolderItem({ folderItem: result, parentId: currentFolderId });
          })
          .catch((err) => console.log(err))
      : filesService
          .update({ fileId: storageItem.id, fileProperties: { name: storageItemName } })
          .then((result) => {
            updateFileItem({ fileItem: result, parentId: currentFolderId });
          })
          .catch((err) => console.log(err));
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle sx={{ backgroundColor: 'background.secondary' }}>
        Rename {storageItem.isFolder ? 'Folder' : 'File'}
      </DialogTitle>
      <DialogContent sx={{ width: '300px', backgroundColor: 'background.secondary' }}>
        <TextField
          autoFocus
          margin="dense"
          label="folder name"
          type="text"
          fullWidth
          variant="standard"
          value={storageItemName}
          onChange={(e) => setStorageItemName(e.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ backgroundColor: 'background.secondary' }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Rename</Button>
      </DialogActions>
    </Dialog>
  );
};
