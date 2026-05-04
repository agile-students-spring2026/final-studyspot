module.exports = {
  apps: [
    {
      name: 'studyspot',
      script: 'server.js',
      cwd: '/var/www/studyspot/back-end',
      instances: 1,
      autorestart: true,
      watch: false,
      env_production: {
        NODE_ENV: 'production',
        PORT: 5001,
      },
    },
  ],
};
