import * as aws from "@pulumi/aws"
import * as awsx from "@pulumi/awsx"
import * as inputs from "@pulumi/aws/types/input"
import * as pulumi from "@pulumi/pulumi"
import { Input, Output } from "@pulumi/pulumi"
import { local } from "@pulumi/command"
import * as docker from "@pulumi/docker"

export = async () => {
  const name = "test-image"

  const imageRepo = new awsx.ecr.Repository(`${name}-repo`, {
    name: `${name}-repo`,
  })

  const password = new local.Command(`${name}-get-ecr-password`, {
    create: "aws ecr get-login-password --region us-east-2",
  })

  const buildImage = (
    name: string,
    imageDir: string,
    tag: Output<string> | string,
  ): docker.Image => {
    return new docker.Image(
      name,
      {
        registry: {
          server: imageRepo.url,
          username: "AWS",
          password: password.stdout,
        },
        build: {
          context: imageDir,
          dockerfile: `${imageDir}/Dockerfile`
        },
        imageName: pulumi.interpolate`${imageRepo.url}:${tag}`
      }
    )
  }

  buildImage(name, "./test-image", "latest")

}
