module.exports = {
  apps: [
    {
      name: 'inaayika-client',
      cwd: '/root/inaayika/client',
      script: 'npm',
      args: 'start',
      env: {
        PORT: 3005,
        NODE_ENV: 'production'
      },
      error_file: "/root/.pm2/logs/inaayika-client-error.log",
      out_file: "/root/.pm2/logs/inaayika-client-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      max_memory_restart: "500M"
    },
    {
      name: 'inaayika-admin',
      cwd: '/root/inaayika/front',
      script: 'npm',
      args: 'run preview',
      env: {
        PORT: 4177,
        NODE_ENV: 'production',
        HOST: '0.0.0.0'
      },
      error_file: "/root/.pm2/logs/inaayika-admin-error.log",
      out_file: "/root/.pm2/logs/inaayika-admin-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      max_memory_restart: "500M"
    },
    {
      name: 'inaayika-server',
      cwd: '/root/inaayika/server',
      script: 'npm',
      args: 'start',
      env: {
        PORT: 4006,
        NODE_ENV: 'production'
      },
      error_file: "/root/.pm2/logs/inaayika-server-error.log",
      out_file: "/root/.pm2/logs/inaayika-server-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      max_memory_restart: "500M"
    },
  ]
};