<?php

namespace app\modules\v1\controllers;

use app\core\interfaces\IUserService;
use app\core\models\User;
use app\core\models\auth\{LoginForm, SignupForm};
use app\core\models\PasswordResetForm;
use Yii;
use yii\rest\ActiveController;

class UserController extends ActiveController
{
    public $modelClass = User::class;
    public $noAuthActions = ['signup', 'login'];

    public $userService;

    public function __construct(
        $id,
        $module,
        IUserService $userService,
        $config = []) {
        $this->userService = $userService;
        parent::__construct($id, $module, $config);
    }

    public function actions()
    {
        $actions = parent::actions();
        unset($actions['update'], $actions['index'], $actions['delete'], $actions['create']);
        return $actions;
    }

    public function actionValidateToken()
    {
        return "ok";
    }

    public function actionSignup()
    {
        $model = new SignupForm();
        $model->load(Yii::$app->request->post());
        if (!$model->validate()) {
            $errors = $model->getErrors();
            return $errors;
        }

        return $this->userService->createUser($model);
    }

    public function actionLogin()
    {
        $model = new LoginForm();
        $model->load(Yii::$app->request->post());
        if (!$model->validate()) {
            $errors = $model->getErrors();
            return $errors;
        }

        $user = Yii::$app->user->identity;
        $token = $this->userService->getToken($user->getId(), $user->username);

        return [
            'user' => $user,
            'token' => (string) $token,
        ];
    }

    public function actionRefreshToken()
    {
        $user = Yii::$app->user->identity;
        $token = $this->userService->getToken($user->getId(), $user->username);
        return [
            'user' => $user,
            'token' => (string) $token,
        ];
    }

    public function actionConfirm()
    {
        if (!empty(Yii::$app->request->get())) {
            $id = Yii::$app->getRequest()->getQueryParam('id');
            $auth_key = Yii::$app->getRequest()->getQueryParam('auth_key');

            try {
                if ($this->userService->confirmUser($id, $auth_key)) {
                    Yii::$app->getResponse()->setStatusCode(200);
                    return $this->redirect(['/confirm?status=confirmado']);
                }

            } catch (\Throwable $th) {}
        }

        return $this->redirect(['/confirm']);
    }

    /**
     * Action to handle the user request of changing their password
     */
    public function actionRequestPasswordReset()
    {
        $authHeader = Yii::$app->request->getHeaders()->get("Authorization");
        preg_match('/^Bearer\s+(.*?)$/', $authHeader, $matches);
        $token = $matches[1];

        if ($this->userService->requestPasswordReset($token)) {
            return "ok";
        }

        Yii::$app->response->statusCode = 500;
        return "failed";
    }

    /**
     * Action to effectively change the user's password
     */
    public function actionPasswordReset()
    {
        $model = new PasswordResetForm();
        $model->load(Yii::$app->request->post());
        if (!$model->validate()) {
            $errors = $model->getErrors();
            return $errors;
        }

        if ($this->userService->resetPassword($model)) {
            return "ok";
        }

        Yii::$app->response->statusCode = 500;
        return "failed";
    }

    public function actionAdminAction()
    {
        $usr = Yii::$app->user;
        $temp = Yii::$app->user->can('manageUsers');
        if (!$temp) {
            throw new \yii\web\ForbiddenHttpException('You are not allowed to perform this action.');
        }
        
        return "AdminOnly";
    }

}
