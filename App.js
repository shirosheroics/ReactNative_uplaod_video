import React from "react";
import { StyleSheet, Text, View, Button, Image } from "react-native";
import { ImagePicker } from "expo";
import { Permissions } from "expo";
import axios from "axios";

export default class App extends React.Component {
  state = {
    image: null
  };
  async componentDidMount() {
    const permission = await Permissions.getAsync(Permissions.CAMERA_ROLL);
    if (permission.status !== "granted") {
      const newPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    }
  }
  render() {
    let { image } = this.state;
    return (
      <View style={styles.container}>
        <Button
          title="Pick an image from camera roll"
          onPress={this._pickImage}
        />
        {image && (
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
        )}
        <Button
          title="upload"
          onPress={() => {
            this.submitFile();
          }}
        />
      </View>
    );
  }

  submitFile() {
    let formData = new FormData();

    formData.append("uploadedfile", this.state.image.replace("file://", ""));
    axios.defaults.headers.common = {
      ...axios.defaults.headers.common,
      "Content-Type ": "multipart/form-data"
    };

    let res = this.state.image.split("/ImagePicker/");
    let format = res[1].split(".");
    let mime = "application/octet-stream";
    var photo = {
      uri: this.state.image,
      type: this.state.type + "/" + format[1],
      name: res[1]
    };
    var body = new FormData();

    body.append("uploadedfile", photo);
    axios
      .post(
        // add your url here
        "",
        body,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      )
      .then(function() {
        console.log("SUCCESS!!");
      })
      .catch(err => {
        console.log(err.response);
      });
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "All",
      base64: false,
      exif: false
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri, type: result.type });
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
