import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from '../ProtectedRoute' 
import Home from '../pages/Home'
import Login from '../pages/Login'
import DashDoctor from '../pages/DashDoctor'
import DashAdministrator from '../pages/DashAdministrator'
import DashPatient from '../pages/DashPatient'
import SelectionRole from '../pages/SelectionRole'
import Users from '../pages/Users'
import CreateUser from '../pages/CreateUser'
import AssignRoles from "../pages/AssignedRole"; 
import Symptons from '../pages/Symptons'
import EarlyDetection from '../pages/EarlyDetecction'
import Recomendations from '../pages/Recomendations'
import Investigation from '../pages/Investigation'
import GuideParents from '../pages/GuideParents'
import Services from '../pages/Services'
import Contact from '../pages/Contact'
import Donation from '../pages/Donation'
import Sessions from '../pages/Sessions'
import Diagnosis from '../pages/Diagnosis'
import ProgressPatient from '../pages/Progress'
import RecomendationsPatient from '../pages/RecomendationsPatient'
import NextEvaluationPatient from '../pages/NextEvaluationPatient'
import DiagnosisIntelligent from '../pages/DiagnosisIntelligent'
import InitMachine from '../pages/InitMachine'


export default function AppRouter(){
    return(
        <BrowserRouter>
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashdoctor" element={<DashDoctor />} />
        <Route path="/dashadministrator" element={<DashAdministrator />} />
        <Route path="/dashpatient" element={<DashPatient />} />
        <Route path="/selectionrole" element={<SelectionRole />} />
        <Route path="/user" element={<Users />} />
        <Route path="/createuser" element={<CreateUser />} />
        <Route path="/assignedroles" element={<AssignRoles />} />
        <Route path="/symptons" element={<Symptons />} />
        <Route path="/earlydetection" element={<EarlyDetection />} />
        <Route path="/recomendations" element={<Recomendations />} />
        <Route path="/investigation" element={<Investigation />} />
        <Route path="/guideparents" element={<GuideParents />} />
        <Route path="/services" element={<Services />} />
        <Route path="/constact" element={<Contact />} />
        <Route path="/donation" element={<Donation />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/diagnosis" element={<Diagnosis />} />
        <Route path="/progresspatient" element={<ProgressPatient />} />
        <Route path="/recomendationspatient" element={<RecomendationsPatient />} />
        <Route path="/nextevaluationpatient" element={<NextEvaluationPatient />} />
        <Route path="/diagnosisintelligent" element={<DiagnosisIntelligent />} />
        <Route path="/initmachine" element={<InitMachine />} />





        {/* Ejemplo de ruta protegida (debe tener path distinto o ser un layout) */}
        <Route path="/protected" element={
            <ProtectedRoute>
                <DashDoctor />
            </ProtectedRoute>
        } />
    </Routes>
</BrowserRouter>

    );
}