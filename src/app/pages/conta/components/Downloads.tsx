import * as React from 'react';
import { UploadDownload } from './partials/UploadDownload';

const Downloads: React.FC = () => {
  return (
    <UploadDownload isUpload={false} />
  )
}

export {Downloads}
