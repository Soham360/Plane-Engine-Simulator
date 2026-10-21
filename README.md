# AERO — Plane Engine Simulator

An interactive, customizable jet-engine workbench inspired by the AXIS Robot Arm Simulator. Built with vanilla JavaScript and Three.js; no package install is required. The pinned Three.js module loads from jsDelivr, so the 3D view needs an internet connection.

## Explore

- Orbit and zoom an animated 3D turbofan or turbojet, switch camera views, and inspect components by clicking or using the component arrows.
- Toggle the housing cutaway, airflow particles and exploded assembly.
- Choose airliner, business-jet or turbojet presets; customize intake diameter, bypass ratio, compressor stages, pressure ratio, turbine inlet temperature and housing finish.
- Adjust throttle, altitude and flight Mach; start and shut down the engine with gradual rotor spool response.
- Read live net thrust, fan RPM, fuel flow, exhaust temperature, mass flows and core station temperatures.
- Review a 60-second thrust trace and export its readings to CSV.
- Save a named build as JSON, reopen it, or resume the last build from local browser storage.

## Run locally

Requires Node.js 18 or later. Run `npm start` and open http://127.0.0.1:5173. Run `npm test` for model and build-validation tests. `npm run build` copies the deployable static site into `dist/`.

To host on GitHub Pages, select **Settings → Pages → Deploy from a branch → main / (root)**. All asset URLs are relative, so repository subpath hosting works. The Sites hosting manifest is independent of GitHub Pages.

## Model and limitations

This is an educational visualization, not an aircraft engineering tool. It uses an ISA troposphere/isothermal lower-stratosphere approximation and a simplified separate-flow Brayton cycle with fixed component efficiencies, compressor/fan shaft work, turbine power balance, a fuel energy balance and pressure-matched nozzle velocities. Thrust is outgoing momentum minus inlet momentum. Inlet mass flow and rotor RPM use illustrative scaling relationships. Compressor stage count changes assumed efficiency; its geometry is procedural.

It excludes choking, component maps, surge, detailed nozzle pressure thrust, thermal limits, installation losses, afterburners, variable gas properties and real aircraft calibration. Fuel consumption and thrust are estimates, especially at high Mach or extreme settings. Throttle zero means idle; Shut down engine commands zero rotor speed. Pause freezes rotor and airflow animation while calculations and telemetry continue. Camera and exploded assembly transitions use interruptible, time-based springs. Selected parts receive a visible tint, outline and anchored label. Reset offers a persistent Undo reset action that restores the previous build, flight conditions, run state, view settings and telemetry. Engine operation, pause state and view options are not saved in build files.

Keyboard: Tab to controls; arrow keys adjust sliders and switch workbench tabs. Reduced-motion preferences suppress rotor/airflow animation and spatial transitions while live readings remain active. Preference changes are respected immediately, including after Reset. Controls provide at least 44 CSS pixel hit areas, scalable text, stronger contrast and reduced-transparency/high-contrast fallbacks. The 3D viewer needs WebGL; the numeric model remains usable if rendering is unavailable.

## Credits

Three.js and OrbitControls use the MIT license in `vendor/THREE-LICENSE.txt`. The workbench layout is inspired by Soham360's Robot-Arm-Simulator. All engine geometry is generated in this project.
