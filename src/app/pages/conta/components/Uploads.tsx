import * as React from 'react';
import { UploadDownload } from './partials/UploadDownload';

const Uploads: React.FC = () => {
  return (
    <UploadDownload isUpload={true} />
  )
}

export {Uploads}
