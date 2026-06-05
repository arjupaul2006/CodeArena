FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    openjdk-21-jdk \
    python3 \
    nodejs \
    npm \
    time \
    && rm -rf /var/lib/apt/lists/*