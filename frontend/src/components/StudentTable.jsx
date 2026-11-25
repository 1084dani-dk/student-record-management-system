
import { useEffect, useRef } from 'react';
import $ from 'jquery';

import DataTable from 'datatables.net-bs5';
import 'datatables.net-buttons-bs5';

import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import 'datatables.net-buttons-bs5/css/buttons.bootstrap5.min.css';

import JSZip from 'jszip';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';

DataTable.use($);

window.JSZip = JSZip;
window.pdfMake = pdfMake;
pdfMake.vfs = pdfFonts.vfs;

function StudentTable({ students, onDelete, onEdit }) {

    const tableRef = useRef(null);
    const dataTableRef = useRef(null);

    useEffect(() => {

        if (!tableRef.current) return;

        if (dataTableRef.current) {
            dataTableRef.current.destroy();
            dataTableRef.current = null;
        }

        dataTableRef.current = $(tableRef.current).DataTable({

            data: students,

            columns: [
                { data: 'id' },
                { data: 'name' },
                { data: 'roll_no' },
                { data: 'email' },
                { data: 'phone' },
                { data: 'department' },
                { data: 'semester' },
                {
                    data: null,
                    title: 'Actions',
                    orderable: false,
                    searchable: false,

                    render: function () {
                        return `
                            <button
                                class="btn btn-sm btn-warning edit-student-btn me-1"
                                type="button"
                            >
                                <i class="bi bi-pencil-square me-1"></i>
                                Edit
                            </button>

                            <button
                                class="btn btn-sm btn-danger delete-student-btn"
                                type="button"
                            >
                                <i class="bi bi-trash me-1"></i>
                                Delete
                            </button>
                        `;
                    }
                }
            ],

            pageLength: 5,

            lengthMenu: [5, 10, 25, 50],

            order: [[0, 'desc']],

            dom: 'Bfrtip',

            buttons: [
                {
                    extend: 'copy',
                    text: '<i class="bi bi-clipboard me-1"></i> Copy',
                    className: 'export-btn export-copy'
                },
                {
                    extend: 'csv',
                    text: '<i class="bi bi-filetype-csv me-1"></i> CSV',
                    className: 'export-btn export-csv'
                },
                {
                    extend: 'excel',
                    text: '<i class="bi bi-file-earmark-excel me-1"></i> Excel',
                    className: 'export-btn export-excel'
                },
                {
                    extend: 'pdf',
                    text: '<i class="bi bi-file-earmark-pdf me-1"></i> PDF',
                    className: 'export-btn export-pdf'
                },
                {
                    extend: 'print',
                    text: '<i class="bi bi-printer me-1"></i> Print',
                    className: 'export-btn export-print'
                }
            ],

            language: {
                emptyTable: 'No student records available',
                search: '',
                searchPlaceholder: 'Search student records...',
                lengthMenu: 'Show _MENU_ records',
                info: 'Showing _START_ to _END_ of _TOTAL_ students',
                infoEmpty: 'No records available',
                paginate: {
                    previous: 'Previous',
                    next: 'Next'
                }
            }

        });

        // Handle Edit button click
        $(tableRef.current).on(
            'click',
            '.edit-student-btn',
            function () {

                const row = dataTableRef.current
                    .row($(this).closest('tr'));

                const student = row.data();

                if (student && typeof onEdit === 'function') {
                    onEdit(student);
                }

            }
        );

        // Handle Delete button click
        $(tableRef.current).on(
            'click',
            '.delete-student-btn',
            function () {

                const row = dataTableRef.current
                    .row($(this).closest('tr'));

                const student = row.data();

                if (student && typeof onDelete === 'function') {
                    onDelete(student.id);
                }

            }
        );

        return () => {

            $(tableRef.current).off(
                'click',
                '.edit-student-btn'
            );

            $(tableRef.current).off(
                'click',
                '.delete-student-btn'
            );

            if (dataTableRef.current) {
                dataTableRef.current.destroy();
                dataTableRef.current = null;
            }

        };

    }, [students, onDelete, onEdit]);

    return (
        <div className="card student-table-card border-0 shadow-sm">

            <div className="card-header student-table-header">
                <div>
                    <h5 className="mb-1 fw-bold">
                        <i className="bi bi-table me-2 text-primary"></i>
                        Student Records
                    </h5>

                    <small className="text-muted">
                        View and manage registered students
                    </small>
                </div>

                <span className="student-count-badge">
                    <i className="bi bi-people-fill me-1"></i>
                    {students.length} Students
                </span>
            </div>

            <div className="card-body student-table-body">

                <div className="table-responsive">

                    <table
                        ref={tableRef}
                        className="table table-hover align-middle student-data-table w-100"
                    >

                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Roll No</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Department</th>
                                <th>Semester</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody></tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}

export default StudentTable;
