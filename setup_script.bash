#!/bin/bash

# manjaro xfce doesnt come with below utils
sudo pacman -S pacaur binutils fakeroot base-devel cmake make automake
pacaur -S yay
yay -Rcs pidgin hexchat gimp xfburn steam-manjaro thunderbird vlc audacious hplip 
gpg --keyserver pool.sks-keyservers.net --recv-keys F57D4F59BD3DF454
yay -S sublime-text-3 sublime-merge 
yay -S terminator
yay -S bleachbit

cd $HOME
mkdir workspace
cd workspace/

# freertos-emulator and dependencies
git clone https://github.com/alpsayin/FreeRTOS-Emulator.git
yay -S sdl2 sdl2_gfx sdl2_image sdl2_mixer sdl2_ttf clang

# mbed-simulator and dependencies
# yay -S python2-pip
# python2 -m pip install mbed-cli
yay -S python-pip
python3 -m pip install mbed-cli
yay -S mercurial
# yay -S nvm
# echo 'source /usr/share/nvm/init-nvm.sh' >> ~/.bashrc
# source /usr/share/nvm/init-nvm.sh
# nvm install --lts
yay -S emsdk
sudo chown -R $USER:$USER /usr/lib/emsdk
sudo emsdk update
emsdk list --old | grep 1.38.21
emsdk install sdk-fastcomp-1.38.21-64bit
emsdk activate sdk-fastcomp-1.38.21-64bit
echo 'source "/usr/lib/emsdk/emsdk_env.sh"' >> $HOME/.bashrc
source /usr/lib/emsdk/emsdk_env.sh

git clone https://github.com/alpsayin/mbed-simulator.git
cd mbed-simulator
npm install
npm install . -g
npm run build-demos

source start_mbed_simulator.bash