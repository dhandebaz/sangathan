<?php

namespace App;

use Illuminate\Foundation\Application as IlluminateApplication;

class Application extends IlluminateApplication
{
    /**
     * Get the path to the public directory.
     *
     * @param  string  $path
     * @return string
     */
    public function publicPath($path = '')
    {
        return $this->joinPaths($this->basePath('public_html'), $path);
    }
}