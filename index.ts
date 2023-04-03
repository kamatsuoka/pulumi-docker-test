import * as docker from "@pulumi/docker"

export = async () => {

  const buildImage = (
    name: string,
    imageDir: string,
    tag: string,
  ): docker.Image => {
    return new docker.Image(
      name,
      {
        build: {
          context: imageDir,
        },
        imageName: `${name}:${tag}`
      }
    )
  }
  const hash = "1234567890" 
  buildImage("test-image", "./test-image", "latest")
  buildImage("test-image-hash", "./test-image", hash)

}
