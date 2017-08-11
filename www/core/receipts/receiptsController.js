angular.module('budgie.controllers', ['budgie.services', 'budgie.itemService']).controller('ReceiptsCtrl', function($scope, $http, $ionicModal, $cordovaCamera, $cordovaFileTransfer, ReceiptsService, ItemsService, UserService, $ionicPopup, AUTH_EVENTS, $state) {
  $scope.user = UserService.currentUser;
  $scope.imgURI;
  $scope.receipts;
  $scope.newItem = {};
  $scope.items = [];
  $scope.newReceipt = {};
  $scope.newTag = {};
  $scope.inputItems = [
    {
      input: 'Item',
      price: '$0.00'
    }
  ];
  $scope.newReceiptItem = {
    name: '',
    price: '',
    tag_id: null
  };
  $scope.listItems = [
    {
      name: '',
      price: '',
      tag_id: null
    }
  ];

  const API_URL = "http://ec2-18-220-68-160.us-east-2.compute.amazonaws.com:8001";

  $scope.getReceipts = function() {
    ReceiptsService.getReceipts($scope.user.id).then((res) => {
      $scope.receipts = ReceiptsService.receipts;
    });
  };

  $scope.getReceipts();

  $scope.takePicture = function() {
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {

      // console.log(imageData, 'image data');
      //function uploadToServer(pictureName, fileURI) {
      //
      //   var options = new FileUploadOptions();
      //   options.fileKey = "file";
      //   options.mimeType = "image/jpeg";
      //   options.fileName = pictureName;
      //
      //   var ft = new FileTransfer();
      //   ft.upload(fileURI, encodeURI(CONSTANTS.hosts.remoteSR),
      //     function (res) {
      //       console.log("Code = " + res.responseCode);
      //     },
      //     function (error) {
      //       $log.debug(error)
      //       alert("An error has occurred: Code = " + error.code);
      //     },
      //     options);
      //
      // }
      // console.log(imageData, 'image data from chosen pic');
      var docImg = document.getElementById('pickedImage');
      docImg.src = "data:image/jpeg;base64," + imageData;
      // console.log(docImg, 'chosen img element');
      var server = `${API_URL}/receipts/image`;
      // console.log(server, 'server path');
      var filePath = imageData;
      console.log(filePath, 'filePath');
      var date = new Date();
      // console.log(date, 'new date');
      var options = {
          fileKey: "userPhoto",
          fileName: imageData.substr(imageData.lastIndexOf('/') + 1),
          chunkedMode: false,
          mimeType: "image/jpg"
      };
      $cordovaFileTransfer.upload(server, filePath, options).then(function(result) {
          console.log("SUCCESS: " + JSON.stringify(result.response));
          console.log('Result_' + result.response[0] + '_ending');
          console.log("success");
          console.log(JSON.stringify(result.response));

      }, function(err) {
          console.log("ERROR: " + JSON.stringify(err));
          //alert(JSON.stringify(err));
      }, function (progress) {
          // constant progress updates
      });


  }, function(err) {
      // error
      console.log(err);
  });
}


  //     console.log(imageData, 'image data b4 upload');
  //     $cordovaFileTransfer.upload(`${API_URL}/receipts/image`, $scope.imgURI, options).then(function(result) {
  //       console.log(result, 'result');
  //     });
  //
  //     $http.post(`${API_URL}/receipts/image`, $scope.imgURI).then((res)=>{
  //       console.log(res, 'POST RESPONSE FROM SERVER');
  //     })
  //
  //     setTimeout(() => {
  //       // $scope.getText();
  //     }, 6000);
  //   }, function(err) {
  //     console.log('error in grabbing image');
  //   });
  // };

  // // open PhotoLibrary
  //     $scope.openPhotoLibrary = function() {
  //         var options = {
  //             quality: 50,
  //             destinationType: Camera.DestinationType.FILE_URI,
  //             sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
  //             allowEdit: true,
  //             encodingType: Camera.EncodingType.JPEG,
  //             popoverOptions: CameraPopoverOptions,
  //             saveToPhotoAlbum: false
  //         };
  //
      //     $cordovaCamera.getPicture(options).then(function(imageData) {
      //
      //         //console.log(imageData);
      //         //console.log(options);
      //         var image = document.getElementById('tempImage');
      //         image.src = imageData;
      //
      //         var server = "http://yourdomain.com/upload.php",
      //             filePath = imageData;
      //
      //         var date = new Date();
      //
      //         var options = {
      //             fileKey: "file",
      //             fileName: imageData.substr(imageData.lastIndexOf('/') + 1),
      //             chunkedMode: false,
      //             mimeType: "image/jpg"
      //         };
      //
      //         $cordovaFileTransfer.upload(server, filePath, options).then(function(result) {
      //             console.log("SUCCESS: " + JSON.stringify(result.response));
      //             console.log('Result_' + result.response[0] + '_ending');
      //             alert("success");
      //             alert(JSON.stringify(result.response));
      //
      //         }, function(err) {
      //             console.log("ERROR: " + JSON.stringify(err));
      //             //alert(JSON.stringify(err));
      //         }, function (progress) {
      //             // constant progress updates
      //         });
      //
      //
      //     }, function(err) {
      //         // error
      //         console.log(err);
      //     });
      // }



  $scope.getText = function() {
    let pickedImage = document.getElementById("pickedImage");

    // clean image
    // ReceiptsService.cleanImage(rawData).then((res) => {


      // console.log(res, 'result, should be tif???');
      // Tesseract.recognize(res).then((result) => {
      //   let lines = result.text.split('\n');
      //   // console.log("LINES?");
      //   // console.log(lines);
      //
      //   let priceRegex = /\d+[\.\,]\d+$/;
      //   for (let i = 0; i < lines.length; i++) {
      //     let item = {};
      //     if (lines[i].match(priceRegex)) {
      //       item.price = lines[i].match(priceRegex)[0];
      //     }
      //     item.name = lines[i].substring(0, lines[i].indexOf(item.price)).trim().toLowerCase();
      //     item.price = item.price.replace(',', '.');
      //     if (item.name && item.price) {
      //       $scope.listItems.unshift(item);
      //       $scope.inputItems.unshift(item);
      //     }
      //   } //END FOR
      //
      // }).catch((err) => {
      //   console.error("********** RECOGNIZE ERROR **************");
      //   console.error(err);
      // });

    // })

    // console.log('getting to get text function');
    // console.log(pickedImage, 'image at text function');
  };

  //ITEM MODAL STUFF
  $ionicModal.fromTemplateUrl('core/receipts/items.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.ItemsModal = modal;
  });

  $scope.showItems = function showItems(receipt) {
    ItemsService.getItems(receipt.id).then((res) => {
      $scope.items = res;
    })
    $scope.receipt = receipt;
    $scope.ItemsModal.show();
  };

  $scope.closeModal = function closeModal() {
    $scope.ItemsModal.hide();
  };

  // RECEIPT MODAL STUFF
  $ionicModal.fromTemplateUrl('core/receipts/add-receipt.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.receiptModal = modal;
  });

  $scope.showAddReceipt = function showAddReceipt() {
    $scope.receiptModal.show();
  };

  $scope.closeReceiptModal = function closeModal() {
    $scope.receiptModal.hide();
  };

  $scope.addInput = function() {
    if ($scope.newReceiptItem.tag_id == null) {
      delete $scope.newReceiptItem.tag_id;
    }
    $scope.listItems.push($scope.newReceiptItem);
    $scope.newReceiptItem = {
      name: '',
      price: '',
      tag_id: null
    };
    $scope.inputItems.push({input: 'Item', price: '$0.00'});
  };

  $scope.deleteInput = function(index) {
    $scope.inputItems.splice(index, 1);
    $scope.listItems.splice(index, 1);
  }

  $scope.addNewReceipt = function() {
    if ($scope.listItems[$scope.listItems.length - 1].name === '') {
      $scope.listItems.splice($scope.listItems.length - 1, 1);
    }
    $scope.newReceipt.listItems = $scope.listItems;
    $http.post(`${API_URL}/receipts/users/${$scope.user.id}`, $scope.newReceipt).then(() => {
      $scope.getReceipts();
      $scope.closeReceiptModal();
    });
  }

  $scope.deleteReceipt = function(receipt) {
    $http.delete(`${API_URL}/receipts/${receipt.id}`).then(() => {
      $scope.getReceipts();
    });
  }

  $scope.getTags = function getTags() {
    $http.get(`${API_URL}/tags/users/${$scope.user.id}`).then((response) => {
      $scope.allTags = response.data;
    });
  };
  $scope.getTags();

  $scope.addTagAlert = function addTagAlert(item) {
    let tagPopup = $ionicPopup.show({
      title: "Add a new tag",
      template: "<input type='text' ng-model='newTag.tag'>",
      scope: $scope,
      buttons: [
        {
          text: 'Cancel',
          onTap: function(e) {
            if ($scope.newTag.tag) {
              $scope.newTag.tag = "";
            }

            ItemsService.getItems(item.receipt_id).then((res) => {
              $scope.items = res;
            });

          }
        }, {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.newTag.tag) {
              e.preventDefault();
            } else {
              $http.post(`${API_URL}/tags/users/${$scope.user.id}`, $scope.newTag).then((response) => {
                console.log(response.data);
                const patchTag = {
                  tag_id: response.data[0].id
                };
                $http.patch(`${API_URL}/receipts/${item.receipt_id}/items/${item.id}`, patchTag).then(() => {
                  $scope.getTags(1);
                  ItemsService.getItems(item.receipt_id).then((res) => {
                    $scope.items = res;
                  });
                  $scope.newTag.tag = "";
                }).catch((err) => {
                  console.error(err);
                });

              }).catch((err) => {
                console.error(err);
              });
            }
          }
        }
      ]
    });

    tagPopup.catch((err) => {
      console.error(err);
    });
  };

  $scope.getSelectedTag = function getSelectedTag(tagSelected, item) {
    if (tagSelected === 'addNewTag') {
      $scope.addTagAlert(item);
    } else {
      delete item.tag;
      for (let j = 0; j < $scope.allTags.length; j++) {
        if ($scope.allTags[j].tag === tagSelected) {
          item.tag_id = $scope.allTags[j].id;
          break;
        }
      }
      $http.patch(`${API_URL}/receipts/${item.rececipt_id}/items/${item.id}`, item);
    }
  };

  $scope.updateReceipt = function(receipt) {
    const updated = {
      location: receipt.location,
      date: receipt.date
    }
    ReceiptsService.editReceipt(receipt.id, updated);
  }

  $scope.editItems = function editItems(item) {
    delete item.tag;
    $http.patch(`${API_URL}/receipts/${item.receipt_id}/items/${item.id}`, item).then(() => {
      ItemsService.getItems(item.receipt_id).then((res) => {
        $scope.items = res;
      });
    });
  };

  $scope.addItem = function addItem(receipt) {
    $scope.newItem.receipt_id = receipt.id;
    $http.post(`${API_URL}/receipts/${receipt.id}/items`, $scope.newItem).then(() => {
      ItemsService.getItems(receipt.id).then((res) => {
        $scope.items = res;
        $scope.newItem = {};
      });
    });
  };

  $scope.deleteItem = function deleteItem(itemID, receiptID) {
    $http.delete(`${API_URL}/receipts/${receiptID}/items/${itemID}`).then(() => {
      ItemsService.getItems(receiptID).then((res) => {
        $scope.items = res;
      })
    });
  };
});
