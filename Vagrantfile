# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "centos/7" # redhat-based just like Amazon Linux in AWS Lambda
  config.ssh.insert_key = false # due to https://github.com/mitchellh/vagrant/issues/5186#issuecomment-237252754
  # config.vm.network "forwarded_port", guest: 80, host: 8080
  config.vm.synced_folder ".", "/vagrant", type: "rsync", rsync__exclude: [".git/", "node_modules/"]
  config.vm.provision "shell", inline: <<-SHELL
    curl --silent --location https://rpm.nodesource.com/setup_4.x | bash -
    yum -y install nodejs
  SHELL
end
