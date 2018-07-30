import React from 'react';
import ImagePicker from 'react-native-image-picker';
import _ from 'lodash'

export function imagePicker(options, funcUpload) {
  let maxWidth = 400;
  let maxHeight = 400;
  if(options) {
    if(options.maxWidth) {
      maxWidth = options.maxWidth
    }
    if(options.maxHeight) {
      maxHeight = options.maxHeight
    }
  }
  const imagePickerOptions = {
    title: 'Select Image',
    mediaType: 'photo',
    maxWidth,
    maxHeight,
    quality: 0.8,
    storageOptions: {
      skipBackup: true
    }
  };
  ImagePicker.showImagePicker(imagePickerOptions, (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.error('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    } else {
      let photoUri = _.replace(response.uri, 'file:///', '');
      let fileName = response.fileName;
      funcUpload(photoUri, fileName);
    }
  });
}
