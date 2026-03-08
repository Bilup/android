const path = require('path');
const {DefinePlugin} = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const base = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    devtool: process.env.NODE_ENV === 'production' ? false : 'cheap-source-map',
    target: 'web',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react']
                }
            },
            {
                test: /\.(svg|png|wav|gif|jpg|mp3|woff2|hex)$/,
                loader: 'file-loader',
                options: {
                    outputPath: 'static/assets/',
                    esModule: false
                }
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            importLoaders: 1,
                            localIdentName: '[name]_[local]_[hash:base64:5]',
                            camelCase: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    'postcss-import',
                                    'postcss-simple-vars',
                                    'autoprefixer'
                                ]
                            }
                        }
                    }
                ]
            }
        ]
    }
}

module.exports = [
    {
        ...base,
        output: {
            path: path.resolve(__dirname, 'dist-renderer-webpack/editor/gui'),
            filename: '../../index.js'
        },
        entry: './src-renderer-webpack/editor/gui/index.jsx',
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                },
                {
                    test: /\.(svg|png|wav|gif|jpg|mp3|woff2|hex)$/,
                    loader: 'file-loader',
                    options: {
                        outputPath: 'static/assets/',
                        publicPath: 'static/assets/',
                        esModule: false
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: 'style-loader'
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                importLoaders: 1,
                                localIdentName: '[name]_[local]_[hash:base64:5]',
                                camelCase: true
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    plugins: [
                                        'postcss-import',
                                        'postcss-simple-vars',
                                        'autoprefixer'
                                    ]
                                }
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new DefinePlugin({
                'process.env.ROOT': '""'
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: 'src-renderer/index.html',
                        to: '../../index.html'
                    },
                    {
                        from: 'node_modules/scratch-blocks/media',
                        to: 'static/blocks-media/default'
                    },
                    {
                        from: 'node_modules/scratch-blocks/media',
                        to: 'static/blocks-media/high-contrast'
                    },
                    {
                        from: 'node_modules/scratch-gui/src/lib/themes/blocks/high-contrast-media/blocks-media',
                        to: 'static/blocks-media/high-contrast',
                        force: true
                    },
                    {
                        context: 'src-renderer-webpack/editor/gui/',
                        from: '*.html',
                        to: './'
                    },
                    // Copy other static pages for Capacitor
                    {
                        from: 'src-renderer/about',
                        to: '../../about'
                    },
                    {
                        from: 'src-renderer/privacy',
                        to: '../../privacy'
                    },
                    {
                        from: 'src-renderer/desktop-settings',
                        to: '../../desktop-settings'
                    },
                    {
                        from: 'src-renderer/packager',
                        to: '../../packager'
                    },
                    {
                        from: 'src-renderer/migrate',
                        to: '../../migrate'
                    },
                    {
                        from: 'src-renderer/update',
                        to: '../../update'
                    },
                    {
                        from: 'src-renderer/security-prompt',
                        to: '../../security-prompt'
                    },
                    {
                        from: 'src-renderer/file-access',
                        to: '../../file-access'
                    }
                ]
            })
        ],
        resolve: {
            symlinks: false,
            alias: {
                react: path.resolve(__dirname, 'node_modules/react'),
                'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
                'scratch-gui$': path.resolve(__dirname, 'node_modules/scratch-gui/src/index.js'),
                'scratch-render-fonts$': path.resolve(__dirname, 'node_modules/scratch-gui/src/lib/tw-scratch-render-fonts'),
            }
        }
    },

    {
        ...base,
        output: {
            path: path.resolve(__dirname, 'dist-renderer-webpack/editor/addons'),
            filename: 'index.js'
        },
        entry: './src-renderer-webpack/editor/addons/index.jsx',
        resolve: {
            symlinks: false,
            alias: {
                react: path.resolve(__dirname, 'node_modules/react'),
                'react-dom': path.resolve(__dirname, 'node_modules/react-dom')
            }
        },
        plugins: [
            new CopyWebpackPlugin({
                patterns: [
                    {
                        context: 'src-renderer-webpack/editor/addons/',
                        from: '*.html',
                        to: './'
                    }
                ]
            })
        ]
    }
];
